import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpModule } from './otp/otp.module';
import { GatewayModule } from './gateway/gateway.module';
import { GameModule } from './game/game.module';
import { RoomModule } from './room/room.module';
import { ParticipantModule } from './participant/participant.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WalletModule } from './wallet/wallet.module';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  MongooseModule.forRoot(process.env.MONGODB_LOCAL_URL, {
    connectionFactory: (connection) => {
      connection.plugin(require('mongoose-autopopulate'));
      return connection;
    },
  }),
  EventEmitterModule.forRoot(),
  UsersModule,
  AuthModule,
  OtpModule,
  GatewayModule,
  GameModule,
  RoomModule,
  ParticipantModule,
  WalletModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
