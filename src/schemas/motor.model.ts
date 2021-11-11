// import * as mongoose from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import plugins from './mongose-plugins';
import { Document } from 'mongoose';
import { Car } from './car.model';

export type TMotorDocument = Motor & Document;

export interface IViewMotor {
  id: string;
  name: string;
  cars: [] | string[];
  createdAt?: string;
  updatedAt?: string;
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
export class Motor {
  @Prop({ type: String, trim: true })
  name: string;

  @Prop({ type: [String], ref: 'Car', default: [], required: true })
  cars: string[];

  view: () => IViewMotor;

  createdAt: string;

  updatedAt: string;
}

export const MotorSchema = SchemaFactory.createForClass(Motor);

export const CustomMotorModule = MongooseModule.forFeatureAsync([
  {
    name: Motor.name,
    useFactory: () => {
      const schema = MotorSchema;

      schema.plugin(plugins.common, { prefix: plugins.prefixes.motor });
      schema.methods.view = function(this: TMotorDocument): IViewMotor {
        return {
          id: this._id,
          name: this.name,
          cars: this.cars,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      };

      return schema;
    },
  },
]);
