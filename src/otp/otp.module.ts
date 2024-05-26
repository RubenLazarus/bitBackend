import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';
import { CommanModule } from 'src/comman/comman.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule,CommanModule,MongooseModule.forFeature(entities)],
  providers: [{
    provide:Services.OTP,
    useClass:OtpService
  }],
  exports: [{
    provide:Services.OTP,
    useClass:OtpService
  }]

})
export class OtpModule {}
