import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentsService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':blogId')
  async create(
    @Param('blogId') blogId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userId = req.user['_id'];
    return this.commentsService.create(blogId, userId, createCommentDto);
  }

  @Get(':blogId')
  async findAll(@Param('blogId') blogId: string) {
    return this.commentsService.findAllByBlogId(blogId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userId = req.user['_id'];
    return this.commentsService.update(id, userId, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userId = req.user['_id'];
    return this.commentsService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':blogId/:commentId/reply')
  async replyToComment(
    @Param('blogId') blogId: string,
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userId = req.user['_id'];
    return this.commentsService.replyToComment(
      blogId,
      commentId,
      userId,
      createCommentDto,
    );
  }
}
