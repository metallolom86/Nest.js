// import * as mongoose from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import plugins from './mongose-plugins';
import { Document } from 'mongoose';
import { IViewUser, TUserDocument, User } from './user.model';

export type TCarDocument = Car & Document;

export interface IViewCar {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
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
export class Car {
  @Prop({ type: String, trim: true })
  name: string;

  @Prop({ type: String, ref: 'User', required: true })
  owner: IViewUser;

  view: () => IViewCar;

  createdAt: string;

  updatedAt: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);

export const CustomCarModule = MongooseModule.forFeatureAsync([
  {
    name: Car.name,
    useFactory: () => {
      const schema = CarSchema;

      schema.plugin(plugins.common, { prefix: plugins.prefixes.car });
      schema.methods.view = function(this: TCarDocument): IViewCar {
        return {
          id: this._id,
          name: this.name,
          owner: this.owner,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      };

      return schema;
    },
  },
]);
