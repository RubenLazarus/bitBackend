import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IWelletService } from './wallet';
import { GetId } from 'src/comman/GetId.decorator';
import { JwtAuthGuard } from 'src/auth/Guards/jwt.guard';

@Controller(Routes.WALLET)
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(
        @Inject(Services.WALLET)
        private readonly WalletService: IWelletService,
      ) {}
    @Post('createWallet')
    async createWallet(@Body() data:any ,@GetId() id:string)
    {
        return await this.WalletService.createWellet(id)
    }
    @Post('addAmountInWallet')
    async addAmountInWallet(@Body() data:any ,@GetId() id:string)
    {
        return await this.WalletService.addAmountInWallet(data,id)
    }
    @Get('getAmountByUserId')
    async getAmountByUserId(@GetId() id:string)
    {
        return await this.WalletService.getAmountByUserId(id)
    }
}
