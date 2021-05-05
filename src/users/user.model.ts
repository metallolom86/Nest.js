// import * as mongoose from 'mongoose';

// export const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// }, { versionKey: false });

// export interface User extends mongoose.Document {
//   id: string;
//   email: string;
//   password: string;
// }

import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import plugins from '../schemas/mongose-plugins';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const availableAdminStatuses = [
  UserRole.ADMIN,
  UserRole.USER,
];

export interface IViewUser {
  id: string;
  role: UserRole[];
  email: string;
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

  @Prop({ required: true, default: [UserRole.USER], type: Array })
  role: UserRole[];

  view: () => IViewUser;
  validatePassword: (s: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const CustomUserModule = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory: () => {
      const schema = UserSchema;

      schema.plugin(plugins.common, { prefix: plugins.prefixes.user });
      schema.methods.view = function (): IViewUser {
        return {
          id: this.id,
          email: this.email,
          role: this.role,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      };

      schema.methods.validatePassword = async function (
        password: string,
      ): Promise<boolean> {
        const isValid = await bcrypt.compare(password, this.password);
        return isValid;
      };

      return schema;
    },
  },
]);