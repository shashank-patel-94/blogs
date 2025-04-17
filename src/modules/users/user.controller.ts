import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('signup')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const extension = extname(file.originalname);
          cb(null, `${randomName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(jpg|jpeg|png|gif)$/i;
        if (!allowedTypes.test(file.originalname)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async signup(
    @Body() createUserDto: UserDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    if (profileImage) {
      createUserDto.profileImage = profileImage.filename;
    }
    return this.usersService.createUser(createUserDto);
  }
}
