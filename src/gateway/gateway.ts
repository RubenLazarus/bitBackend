import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Roles, Services } from "src/utils/constants";
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

    let newOrder:any = await this.ParticipantService.order(data, client?.user?._id);
  
// if(newOrder && newOrder?.success){
//   newOrder.data.userName = client?.user?.displayName
//     console.log("new order", newOrder,newOrder.data.userName)
// }
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      if(res?.user?.role==Roles.ADMIN || res?.user?.role==Roles.SUPERADMIN){

        res.emit('newOrder', newOrder)
      }
    })
    client.emit("orderCreation", newOrder)

  }
  @OnEvent('user.result')
  async resuletEvent(payload: any) {
    let userSocket = this.sessions.getUserSocket(payload?.userId)
    console.log(payload)
    if (userSocket) {
      userSocket.emit('resultOfRoom', { success: true, message: "Please Reload" })
    }
  }
  @OnEvent('announced.result')
  async announcedResuletEvent(payload: any) {
    let userSocket = this.sessions.getUserSocket(payload?.userId)
    console.log(payload)
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      res.emit('resultOfRoom', payload)
    })

    // if (userSocket) {
    //   userSocket.emit('resultOfRoom', { success: true, message: "Please Reload" })
    // }
  }
  @OnEvent('announced.update_ststus')
  async updateStatus(payload: any) {
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      if(res?.user?.role==Roles.ADMIN || res?.user?.role==Roles.SUPERADMIN){

        res.emit('updatedStatus', payload)
      }
    })

    // if (userSocket) {
    //   userSocket.emit('resultOfRoom', { success: true, message: "Please Reload" })
    // }
  }
  @OnEvent('wallet.amount')
  async walletAmountEvent(payload: any) {
    let userSocket = this.sessions.getUserSocket(payload?.userId)
    console.log(payload)
    if (userSocket) {
      userSocket.emit('walletChange', payload)
    }
  }
}