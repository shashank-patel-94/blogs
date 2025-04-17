import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { User } from '../users/schemas/user.schema';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<Blog>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(
    userId: string,
    createBlogDto: CreateBlogDto,
    blogImage?: Express.Multer.File,
  ): Promise<Blog> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    let imageUrl = '';
    if (blogImage) {
      imageUrl = `${this.configService.get('BASE_URL')}/uploads/blog-images/${blogImage.filename}`;
    }

    const createdBlog = new this.blogModel({
      ...createBlogDto,
      author: userId,
      blogImage: imageUrl,
    });
    return createdBlog.save();
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogModel.find().populate('author', 'name').exec();
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findById(id)
      .populate('author', 'name')
      .exec();
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return blog;
  }

  async update(
    id: string,
    userId: string,
    updateBlogDto: UpdateBlogDto,
    blogImage?: Express.Multer.File,
  ): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    if (blog.author.toString() !== userId.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to update this blog',
      );
    }

    let imageUrl = blog.blogImage;

    if (blogImage) {
      // Delete the old image if it exists
      if (imageUrl) {
        const oldImagePath = imageUrl.replace(
          `${this.configService.get('BASE_URL')}/`,
          '',
        );
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          //  Handle the error, e.g., log it
          console.error(`Error deleting old image: ${error}`);
        }
      }
      imageUrl = `${this.configService.get('BASE_URL')}/uploads/blog-images/${blogImage.filename}`; // Construct new URL
    }

    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(
        id,
        { ...updateBlogDto, blogImage: imageUrl }, // Include the image URL in the update
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedBlog) {
      throw new BadRequestException('Failed to update blog');
    }
    return updatedBlog;
  }

  async remove(id: string, userId: string): Promise<void> {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    if (blog.author.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this blog',
      );
    }
    // Delete associated image
    if (blog.blogImage) {
      const imagePath = blog.blogImage.replace(
        `${this.configService.get('BASE_URL')}/`,
        '',
      );
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error(`Error deleting image: ${error}`);
      }
    }

    await this.blogModel.findByIdAndDelete(id);
  }
}
