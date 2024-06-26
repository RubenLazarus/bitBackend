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
    console.log("userLocked in with id ", socket.user?._id, socket.user)
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

    let newParticipant = await this.ParticipantService.createNewLuckyHitParticipant(data, client?.user?._id);

    client.emit("newParticipant", newParticipant)


  }
  @SubscribeMessage('bitAmountOrder')
  async handleBitAmountorder(@MessageBody() data: any, @ConnectedSocket() client: any) {

    let newOrder: any = await this.ParticipantService.order(data, client?.user?._id);

    // if(newOrder && newOrder?.success){
    //   newOrder.data.userName = client?.user?.displayName
    //     console.log("new order", newOrder,newOrder.data.userName)
    // }
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      if (res?.user?.role == Roles.ADMIN || res?.user?.role == Roles.SUPERADMIN) {

        res.emit('newOrder', newOrder)
      }
    })
    client.emit("orderCreation", newOrder)

  }
  @OnEvent('user.result')
  async resuletEvent(payload: any) {
    let userSocket = this.sessions.getUserSocket(payload?.userId)
    // console.log(payload)
    if (userSocket) {
      userSocket.emit('resultOfRoom', { success: true, message: "Please Reload" })
    }
  }

  @OnEvent('announced.result')
  async announcedResuletEvent(payload: any) {
    let userSocket = this.sessions.getUserSocket(payload?.userId)
    // console.log(payload)
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
      // console.log(res?.user, "1")
      if (res?.user?.role == Roles.ADMIN || res?.user?.role == Roles.SUPERADMIN) {
        // console.log(res?.user, "2")
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
  // Lucky Hit


  @OnEvent('luckyhit.newroom')
  handleluckyHitRoom(payload: any) {
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      res.emit('luckyHitRoom', payload)
    })
  }
  @OnEvent('announced.update_status_lucky_hit')
  async update_status_lucky_hit(payload: any) {
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      if (res?.user?.role == Roles.ADMIN || res?.user?.role == Roles.SUPERADMIN) {
        res.emit('updatedStatusLuckyHit', payload)
      }
    })
  }
  @SubscribeMessage('CreateNewLuckyHitParticipant')
  async handleCreateNewLuckyHitParticipant(@MessageBody() data: any, @ConnectedSocket() client: any) {
    console.log(data, client?.user,'CreateNewLuckyHitParticipant')

    let newParticipant = await this.ParticipantService.createNewLuckyHitParticipant(data, client?.user?._id);

    client.emit("newParticipant", newParticipant)


  }
  @OnEvent('user.lucky.hit')
  async resuletLuckyHitEvent(payload: any) {
    let userSocket = this.sessions.getUserSocket(payload?.userId)
    // console.log(payload)
    if (userSocket) {
      userSocket.emit('resultOfRoomLuckyHit', { success: true, message: "Please Reload" })
    }
  }
  @OnEvent('announced.result.lucky.hit')
  async announcedResuletLuckyHitEvent(payload: any) {
    let userSocket = this.sessions.getUserSocket(payload?.userId)
    // console.log(payload)
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      res.emit('resultOfRoomLuckyHit', payload)
    })

    // if (userSocket) {
    //   userSocket.emit('resultOfRoom', { success: true, message: "Please Reload" })
    // }
  }
  @SubscribeMessage('bitLuckyHitAmountOrder')
  async handlebitLuckyHitAmountOrder(@MessageBody() data: any, @ConnectedSocket() client: any) {

    let newOrder: any = await this.ParticipantService.luckyHitOrder(data, client?.user?._id);

    // if(newOrder && newOrder?.success){
    //   newOrder.data.userName = client?.user?.displayName
    //     console.log("new order", newOrder,newOrder.data.userName)
    // }
    let socket = this.sessions.getSockets()
    socket.forEach(res => {
      if (res?.user?.role == Roles.ADMIN || res?.user?.role == Roles.SUPERADMIN) {

        res.emit('newOrder', newOrder)
      }
    })
    client.emit("orderCreation", newOrder)

  }
}