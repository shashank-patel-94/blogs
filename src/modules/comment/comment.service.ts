import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { BlogService } from '../blogs/blog.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private readonly blogsService: BlogService,
  ) {}

  async create(
    blogId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const blog = await this.blogsService.findOne(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    const createdComment = new this.commentModel({
      ...createCommentDto,
      commenter: userId,
      blog: blogId,
    });
    return createdComment.save();
  }

  async findAllByBlogId(blogId: string): Promise<Comment[]> {
    const blog = await this.blogsService.findOne(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return this.commentModel
      .find({ blog: blogId })
      .populate('commenter', 'name')
      .exec();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(id)
      .populate('commenter', 'name')
      .exec();
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  async update(
    id: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    if (comment.commenter.toString() !== userId.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to update this comment',
      );
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedComment) {
      throw new BadRequestException('Failed to update comment');
    }
    return updatedComment;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    if (comment.commenter.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this comment',
      );
    }

    await this.commentModel.findByIdAndDelete(id);
  }

  async replyToComment(
    blogId: string,
    commentId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const blog = await this.blogsService.findOne(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    const parentComment = await this.findOne(commentId);
    if (!parentComment) {
      throw new NotFoundException(
        `Parent Comment with id ${commentId} not found`,
      );
    }

    const reply = new this.commentModel({
      ...createCommentDto,
      author: userId,
      blog: blogId,
      parent: commentId,
    });
    return reply.save();
  }
}
