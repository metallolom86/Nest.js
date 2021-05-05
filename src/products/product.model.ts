// import * as mongoose from 'mongoose';
import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import plugins from '../schemas/mongose-plugins';
import { Document } from 'mongoose';

// export const ProductSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   createdAt: { type: String, required: true },
// }, { versionKey: false });
export type ProductDocument = Product & Document;

export interface Product {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
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


  @Prop({ type: Number, trim: true })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export const CustomProductModule = MongooseModule.forFeatureAsync([
  {
    name: Product.name,
    useFactory: () => {
      const schema = ProductSchema;

      schema.plugin(plugins.common, { prefix: plugins.prefixes.product });

      return schema;
    },
  },
]);
