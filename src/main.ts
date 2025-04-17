import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve static files (e.g., uploaded images)
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // Set a global API prefix
  app.setGlobalPrefix('api/v1');

  const port = process?.env?.SERVER_PORT || 3005;

  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}/api/v1`);
}

bootstrap();
