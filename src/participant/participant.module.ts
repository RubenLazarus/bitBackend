import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    MongooseModule.forFeature(entities)
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
