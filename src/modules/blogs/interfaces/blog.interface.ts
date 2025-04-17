import mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export interface Blog extends mongoose.Document {
  title: string;
  description: string;
  author: mongoose.Schema.Types.ObjectId | User;
  blogImage?: string;
  createdAt: Date;
}
