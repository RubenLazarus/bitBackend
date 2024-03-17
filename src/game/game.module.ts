import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';
import { Services } from 'src/utils/constants';

@Module({
  imports:[MongooseModule.forFeature(entities)],
  controllers: [GameController],
  providers: [{
    provide:Services.GAME,
    useClass:GameService
  }],
  exports:[{
    provide:Services.GAME,
    useClass:GameService
  }]
})
export class GameModule {}
