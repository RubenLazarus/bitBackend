import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';
import { Services } from 'src/utils/constants';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature(entities),WalletModule
  ],
  controllers: [ParticipantController],
  providers: [{
    provide:Services.PARTICIPANT,
    useClass:ParticipantService
  }],
  exports: [{
    provide:Services.PARTICIPANT,
    useClass:ParticipantService
  }]
})
export class ParticipantModule {}
