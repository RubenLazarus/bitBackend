import { Module } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Services } from 'src/utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewaySessionManager } from './gateway.session';
import { UsersModule } from 'src/users/users.module';
import { entities } from 'src/utils/entities';
import { Gateway } from './gateway';

@Module({
  imports: [MongooseModule.forFeature(entities),UsersModule],
  providers:[Gateway,JwtService, {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },],
    exports: [
      Gateway,
      {
        provide: Services.GATEWAY_SESSION_MANAGER,
        useClass: GatewaySessionManager,
      },
    ],
})
export class GatewayModule {}
