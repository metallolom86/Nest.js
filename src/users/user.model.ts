import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
}, { versionKey: false });

export interface User extends mongoose.Document {
  id: string;
  login: string;
  password: string;
}