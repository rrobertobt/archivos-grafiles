import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { mainSeeder } from './database/seeds/main.seeder';

async function bootstrap() {
  // Before creating the NestJS application, we need to run the database seeder
  // to create the initial data for the application
  await mainSeeder();

  // Create the NestJS application and listen on port 8000
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    exposedHeaders: ['Authorization', 'authorization'],
  });
  await app.listen(8000);
}
bootstrap();
