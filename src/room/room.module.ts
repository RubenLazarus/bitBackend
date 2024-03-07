import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { RoomService } from './room.service';
@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
