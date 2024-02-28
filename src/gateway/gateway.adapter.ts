import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from 'src/utils/interface';


export class WebsocketAdapter extends IoAdapter {
  private jwtService: JwtService;
  constructor(private app: INestApplicationContext) {
    super(app);
    app.resolve<JwtService>(JwtService).then((jwtService) => {
      this.jwtService = jwtService;
    });
  }
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
        try {
            if (!socket.handshake.headers?.authorization) {
                console.log('Client has no auth Token');
                return next(new Error('Not Authenticated. No auth Token were sent'));
              }
              let auth_token = socket.handshake.headers.authorization;
              auth_token = auth_token.split(' ')[1];
              const user = this.jwtService.verify(auth_token, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
              });
              if (!user) {
                return next(new Error('Auth Token is invalid please check'));
              }
             
              socket.user = user;
              next();    
        } catch (error) {
            return next(new Error('Auth Token is invalid please check'));
        }
  

    }
    
    );

    return server;
  }
}
