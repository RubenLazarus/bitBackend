import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata"
import * as passport from 'passport'
import { ValidationPipe } from '@nestjs/common';
import { WebsocketAdapter } from './gateway/gateway.adapter';
require('dotenv').config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  app.enableCors()
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe())
  app.use(passport.initialize())
  const adapter = new WebsocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  await app.listen(parseInt(process.env.PORT_LOCAL));
}
bootstrap();
