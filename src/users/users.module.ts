import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';

@Module({
  imports:[MongooseModule.forFeature(entities)],
  controllers: [UsersController],
  providers: [{
    provide:Services.USERS,
    useClass:UsersService
  }]
})
export class UsersModule {}
