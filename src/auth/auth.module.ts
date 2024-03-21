import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Services } from 'src/utils/constants';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';
import { OtpModule } from 'src/otp/otp.module';
import { CommanModule } from 'src/comman/comman.module';
import { smsService } from 'src/comman/sms.service';
import { HttpModule } from '@nestjs/axios';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [OtpModule,UsersModule,CommanModule, MongooseModule.forFeature(entities),HttpModule,WalletModule],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    smsService,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
})
export class AuthModule {}
