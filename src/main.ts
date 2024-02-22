import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata"
import * as passport from 'passport'
import { ValidationPipe } from '@nestjs/common';
require('dotenv').config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  app.enableCors()
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe())
  app.use(passport.initialize())
  await app.listen(process.env.PORT_LOCAL);
}
bootstrap();
