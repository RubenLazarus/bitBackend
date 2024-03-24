import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { room, roomDetails } from 'src/entities/room.entity';
import { IGameService } from 'src/game/game';
import { IParticipantService } from 'src/participant/participant';
import { Services, roomStatus } from 'src/utils/constants';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(room.name) private roomRepository: Model<roomDetails>,
        private readonly events: EventEmitter2,
        @Inject(Services.GAME)
        private readonly gameService: IGameService,
        @Inject(Services.PARTICIPANT)
        private readonly paticipantService: IParticipantService,
    ) { }
    async createRoom(data) {
        let currentTime = new Date()
        let object = {
            gameId: data.gameId,
            status: roomStatus?.CONTINUE,
            createdAt: currentTime,
            startTime: currentTime,
            endTime: (currentTime.getTime() + data?.time * 60000)
        }
        let createdRoom = await this.roomRepository.create(object)
        this.events.emit('color.newroom', {
            success: true,
            message: "New Room is created",
            data: createdRoom
        })
        return {
            success: true,
            message: "New Room is created",
            data: createdRoom
        }
    }
    async changeStatus(data) {
        if (!data?.roomId) {
            return {
                success: false,
                message: "Room id is required",
            }

        }
        if (!Object.values(roomStatus).includes(data?.status)) {
            return {
                success: false,
                message: "status is unknow"
            }
        }
        let object: any = {}
        if (data?.status == roomStatus?.COMPLEDTED) {
            object.status = roomStatus?.COMPLEDTED
        }
        if (data?.status == roomStatus?.PENDING) {
            object.status = roomStatus?.PENDING
        }
        if (data?.isContinue == false) {
            object.isContinue = false
        }


        let updataedStatus = await this.roomRepository.findByIdAndUpdate(data?.roomId, {
            $set: object
        }, { new: true })
        return {
            success: true,
            message: "changes Update",
            data: updataedStatus
        }
    }
    async getAllRooms(data) {
        let object: any = {}
        if (data?.gameId) {
            object.gameId = data?.gameId
        }
        let allRooms = await this.roomRepository.aggregate([{
            $match: object
        }, {
            $lookup: {
                from: 'games',
                localField: 'gameId',
                foreignField: '_id',
                as: 'gameData',
            },
        }
        ])
        return {
            success: true,
            message: "All Room",
            data: allRooms
        }
    }

    @Cron('* * * * * *')
    async regulateColorGame() {

        let room: any = await this.roomRepository.findOne({ isContinue: true })
        let game: any = await this.gameService.getGameByName('Color Game')
        if (!room) {

            if (game?.success) {
                let object = {
                    gameId: game?.data?._id,
                    time: 3
                }
                await this.createRoom(object)
                return;
            }
        }
        const currentTime = new Date();
        const thirtySecondsAgo = new Date(new Date(room?.endTime).getTime() - 30 * 1000);
        // console.log(`${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`, `${thirtySecondsAgo.getHours()}:${thirtySecondsAgo.getMinutes()}:${thirtySecondsAgo.getSeconds()}`, "new " + `${thirtySecondsAgo.getSeconds() + 1}`)
        if (currentTime.getHours() == thirtySecondsAgo.getHours() && currentTime.getMinutes() == thirtySecondsAgo.getMinutes() && (currentTime.getSeconds() == thirtySecondsAgo.getSeconds() || currentTime.getSeconds() == thirtySecondsAgo.getSeconds() + 1)) {
            let data = {
                roomId: room?._id,
                status: roomStatus.PENDING
            }
            await this.changeStatus(data)
        }
        if (currentTime > new Date(room?.endTime)) {
            let data = {
                roomId: room?._id,
                status: roomStatus.PENDING,
                isContinue: false
            }
            await this.changeStatus(data)
        }

    }

    async submitResult(data) {
        if (!data?.roomId) {
            return {
                success: false,
                message: "please send Room Id"
            }
        }
        let totalAmount = await this.paticipantService.getTotalAmountByRoomId(data);

        let object = {
            totalAmount: totalAmount?.data[0]?.sum,
            winColor: data?.winColor,
            winNumber: data?.winNumber,
            isContinue:false,
            status:roomStatus.COMPLEDTED
        }
        let updateroom = await this.roomRepository.findByIdAndUpdate(data?.roomId, { $set: object }, { new: true })

        this.paticipantService.sendMoneyToAllWinner(updateroom)

        return {
            success:true,
            message:"Result",
            data:updateroom
        }
    }
}
