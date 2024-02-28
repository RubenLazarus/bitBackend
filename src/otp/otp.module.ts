import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';

@Module({
  imports:[MongooseModule.forFeature(entities)],
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
