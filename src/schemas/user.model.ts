import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import plugins from './mongose-plugins';
import { Product, IViewProduct, ProductSchema } from './product.model';
import * as bcrypt from 'bcrypt';
import { Car, CarSchema } from './car.model';

export type TUserDocument = User & Document;

export enum UserRoles {
  user = 'user',
  admin = 'admin',
}

export const availableAdminStatuses = [UserRoles.admin, UserRoles.user];

export interface IViewUser {
  id: string;
  role: UserRoles[];
  email: string;
  product?: null | Product;
  cars?: [] | string[];
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
export class User {
  @Prop({ type: String, trim: true })
  email: string;

  @Prop({ type: String, trim: true })
  password: string;

  @Prop({ type: String, ref: 'Product', required: false })
  product: Product;

  @Prop({ type: [String], ref: Car.name, default: [], required: false })
  cars: string[];

  @Prop({ required: true, default: [UserRoles.user], type: Array })
  role: UserRoles[];

  view: () => IViewUser;
  validatePassword: (s: string) => Promise<boolean>;

  createdAt: string;

  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const CustomUserModule = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory: () => {
      const schema = UserSchema;

      schema.plugin(plugins.common, { prefix: plugins.prefixes.user });
      schema.methods.view = function(this: TUserDocument): IViewUser {
        return {
          id: this._id,
          email: this.email,
          role: this.role,
          product: this.product,
          cars: this.cars,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      };

      schema.methods.validatePassword = async function(
        this: TUserDocument,
        password: string,
      ): Promise<boolean> {
        const isValid = await bcrypt.compare(password, this.password);
        return isValid;
      };

      return schema;
    },
  },
]);
