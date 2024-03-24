import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Services } from "src/utils/constants";
import { AuthenticatedSocket } from "src/utils/interface";
import { IGatewaySessionManager } from "./gateway.session";
import { OnEvent } from "@nestjs/event-emitter";
import { GetId } from "src/comman/GetId.decorator";
import { Socket } from "socket.io-client";
import { IParticipantService } from "src/participant/participant";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class Gateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    private readonly sessions: IGatewaySessionManager,
    @Inject(Services.PARTICIPANT)
    private readonly ParticipantService: IParticipantService,
  ) { }

  @WebSocketServer()
  server: Server;


  handleDisconnect(socket) {
    console.log('handleDisconnect');
    console.log(`${socket.user._id} disconnected.`);
  }
  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    this.sessions.setUserSocket(socket.user._id, socket);
    console.log("userLocked in with id ", socket.user?._id)
    socket.emit('connected', { status: 'good' });

  }

  @OnEvent('color.newroom')
  handleNewRoom(payload: any) {
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      res.emit('newRoom', payload)
    })
  }

  @SubscribeMessage('createNewParticipant')
  async handleCreateNewParticipant(@MessageBody() data: any, @ConnectedSocket() client: any) {
    console.log(data, client?.user)

    let newParticipant = await this.ParticipantService.createParticipant(data, client?.user?._id);

    client.emit("newParticipant", newParticipant)


  }
  @SubscribeMessage('bitAmountOrder')
  async handleBitAmountorder(@MessageBody() data: any, @ConnectedSocket() client: any) {

    let newOrder = await this.ParticipantService.order(data, client?.user?._id);

    client.emit("orderCreation", newOrder)


  }
}