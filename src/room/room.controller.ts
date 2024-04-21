import { Body, Controller, Get, Inject, Post, Put, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IRoomService } from './room';
import { JwtAuthGuard } from 'src/auth/Guards/jwt.guard';

@Controller(Routes.ROOM)
@UseGuards(JwtAuthGuard)
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
      @Get('getActiveRoom')
      async getActiveRooms(){
        return await this.RoomService.getActiveRooms()
      }
      @Get('getActiveluckyHitRooms')
      async getActiveluckyHitRooms(){
        return await this.RoomService.getActiveluckyHitRooms()
      }
      @Get('createDeck')
      async createDeck(){
        return await this.RoomService.createDeck()
      }
      @Post('logicCheck')
      async logicCheck(@Body() data){
        const {Black,Red}=data;
        return await this.RoomService.logicCheck(Black,Red)
      }
}
