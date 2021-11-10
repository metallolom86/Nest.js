// import * as mongoose from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import plugins from './mongose-plugins';
import { Document } from 'mongoose';
import { IViewUser, TUserDocument, User } from './user.model';

export type TProductDocument = Product & Document;

export interface IViewProduct {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  price: number;
  owner?: IViewUser;
}
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => {
      delete ret._id;
    },
  },
})
export class Product {
  @Prop({ type: String, trim: true })
  title: string;

  @Prop({ type: String, trim: true })
  description: string;

  @Prop({ type: String, ref: User.name, required: false })
  owner: User;

  @Prop({ type: Number, trim: true })
  price: number;

  view: () => IViewProduct;

  createdAt: string;

  updatedAt: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export const CustomProductModule = MongooseModule.forFeatureAsync([
  {
    name: Product.name,
    useFactory: () => {
      const schema = ProductSchema;

      schema.plugin(plugins.common, { prefix: plugins.prefixes.product });
      schema.methods.view = function(this: TProductDocument): IViewProduct {
        return {
          id: this._id,
          title: this.title,
          description: this.description,
          price: this.price,
          owner: this.owner.view(),
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      };

      schema.pre<TProductDocument>('save', async function(next) {
        await this.model(User.name).updateOne(
          { _id: this.owner },
          { $set: { product: this._id } },
        );
        next();
      });

      schema.pre<TProductDocument>('remove', async function(next) {
        await this.model(User.name).updateOne(
          { _id: this.owner },
          { $set: { product: undefined } },
        );
        next();
      });

      return schema;
    },
  },
]);
