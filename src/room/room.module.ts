import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';
import { Services } from 'src/utils/constants';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature(entities)
  ],
  controllers: [RoomController],
  providers: [{
    provide:Services.ROOM,
    useClass:RoomService
  }]
})
export class RoomModule {}
