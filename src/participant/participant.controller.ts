import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IParticipantService } from './participant';
import { JwtAuthGuard } from 'src/auth/Guards/jwt.guard';
import { GetId } from 'src/comman/GetId.decorator';

@Controller(Routes.PARTICIPANT)
@UseGuards(JwtAuthGuard)
export class ParticipantController {
    constructor(
        @Inject(Services.PARTICIPANT)
        private readonly ParticipantService: IParticipantService,
    ) { }
    @Post('createParticipant')
    async createParticipant(@Body() data: any, @GetId() id: string) {
        return await this.ParticipantService.createParticipant(data, id)
    }
     @Post('getAllParticipantByRoomId')
    async getAllParticipantByRoomId(@Body() data: any) {
        return await this.ParticipantService.getAllParticipantByRoomId(data)
    }
     @Post('orderListByParticipant')
    async orderListByParticipant(@Body() data: any, @GetId() id) {
        return await this.ParticipantService.orderListByParticipant(data,id)
    }
     @Post('getAllOrderListByRoomId')
    async getAllOrderListByRoomId(@Body() data: any) {
        return await this.ParticipantService.getAllOrderListByRoomId(data)
    }
}
