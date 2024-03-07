import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IGameService } from './game';

@Controller(Routes.GAME)
export class GameController {
    constructor(
        @Inject(Services.GAME)
        private readonly gameService: IGameService,
      ) {}
      @Post('createGame')
      async createOtherUser( @Body() body) {
        return await this.gameService.createGame(body);
      }


}
