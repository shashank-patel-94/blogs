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
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { BlogService } from './blog.service';

// Multer configuration for blog image uploads
const blogImageStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/blog-images/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const fileExtension = extname(file.originalname);
    cb(null, `${randomName}${fileExtension}`);
  },
});

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogsService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('blogImage', { storage: blogImageStorage }))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
    @UploadedFile() blogImage: Express.Multer.File,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userId = req.user['_id'];
    return this.blogsService.create(userId, createBlogDto, blogImage);
  }

  @Get()
  async findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('blogImage', { storage: blogImageStorage }))
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: Request,
    @UploadedFile() blogImage?: Express.Multer.File,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userId = req.user['_id'];
    return this.blogsService.update(id, userId, updateBlogDto, blogImage);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }
    const userId = req.user['_id'];
    return this.blogsService.remove(id, userId);
  }
}
