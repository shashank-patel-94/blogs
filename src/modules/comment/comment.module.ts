import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comment.schema';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { BlogModule } from '../blogs/blog.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    forwardRef(() => BlogModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
