import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';

@Module({
  imports:[MongooseModule.forFeature(entities)],
  controllers: [WalletController],
  providers: [{
    provide:Services.WALLET,
    useClass:WalletService
  }],
  exports:[{
    provide:Services.WALLET,
    useClass:WalletService
  }]
})
export class WalletModule {}
