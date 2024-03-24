import { Body, Controller, Inject, Post, Put } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IRoomService } from './room';

@Controller(Routes.ROOM)
export class RoomController {
    constructor(
        @Inject(Services.ROOM)
        private readonly RoomService: IRoomService,
      ) {}
      @Post('createRoom')
      async createRoom(@Body() data:any)
      {
        return await this.RoomService.createRoom(data);
      }
      @Post('changeStatus')
      async changeStaus(@Body() data:any){
        return await this.RoomService.changeStatus(data)
      }
      @Post('getAllRooms')
      async getAllRooms(@Body() data:any){
        return await this.RoomService.getAllRooms(data)
      }
      @Post('submitResult')
      async submitResult(@Body() data:any){
        return await this.RoomService.submitResult(data)
      }
}
