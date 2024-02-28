import { Inject } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Services } from "src/utils/constants";
import { AuthenticatedSocket } from "src/utils/interface";
import { IGatewaySessionManager } from "./gateway.session";

@WebSocketGateway({
    cors: {
      origin: '*',
    },
    pingInterval: 10000,
    pingTimeout: 15000,
  })
  export class Gateway
    implements OnGatewayConnection, OnGatewayDisconnect
  {
    constructor(
      @Inject(Services.GATEWAY_SESSION_MANAGER)
      private readonly sessions: IGatewaySessionManager,){}
      handleDisconnect(socket) {
        console.log('handleDisconnect');
          console.log(`${socket.user._id} disconnected.`);
      }
      handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
        console.log('Incoming Connection');
        this.sessions.setUserSocket(socket.user._id, socket);
        console.log("userLocked in with id ",socket.user?._id)
        socket.emit('connected', { status: 'good' });
        
      }
      @WebSocketServer()
      server: Server;
    
    }