import mongoose from 'mongoose';
import { Blog } from 'src/modules/blogs/schemas/blog.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export interface Comment extends mongoose.Document {
  text: string;
  author: mongoose.Schema.Types.ObjectId | User;
  blog: mongoose.Schema.Types.ObjectId | Blog;
  createdAt: Date;
  parent?: mongoose.Schema.Types.ObjectId | Comment;
}
