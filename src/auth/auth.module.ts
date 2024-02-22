import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Services } from 'src/utils/constants';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from 'src/utils/entities';

@Module({
  imports: [UsersModule, MongooseModule.forFeature(entities)],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: Services.USERS,
      useClass: UsersService,
    },
  ],
})
export class AuthModule {}
