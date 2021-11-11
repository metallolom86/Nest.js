// import * as mongoose from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import plugins from './mongose-plugins';
import { Document } from 'mongoose';
import { IViewUser } from './user.model';
import { Motor } from './motor.model';

export type TCarDocument = Car & Document;

export interface IViewCar {
  id: string;
  brand: string;
  motors: [] | string[];
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
  brand: string;

  @Prop({ type: String, ref: 'User', required: true })
  owner: IViewUser;

  @Prop({ type: [String], ref: 'Motor', default: [], required: true })
  motors: string[];

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
          brand: this.brand,
          motors: this.motors,
          owner: this.owner,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      };

      return schema;
    },
  },
]);
