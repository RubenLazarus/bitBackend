import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { room, roomDetails } from 'src/entities/room.entity';
import { roomStatus } from 'src/utils/constants';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(room.name) private roomRepository: Model<roomDetails>,
    ) { }
    async createRoom(data) {
        let object = {
            gameId: data.gameId,
            status: roomStatus?.UPCOMING,
            createdAt: new Date()
        }

        let createdRoom = await this.roomRepository.create(object)

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
        if (data?.status == roomStatus?.CONTINUE) {
            object.status = roomStatus?.CONTINUE,
                object.startTime = new Date()
        }
        if (data?.status == roomStatus?.COMPLEDTED) {
            object.status = roomStatus?.COMPLEDTED,
                object.endTime = new Date()
        }


        let updataedStatus = await this.roomRepository.findByIdAndUpdate(data?.roomId, {
            $set: object
        },{new:true})
       return {
        success :true,
        message:"changes Update",
        data:updataedStatus
       }
    }
    async getAllRooms(data){
        let object:any ={}
        if(data?.gameId){
            object.gameId= data?.gameId
        }
        let allRooms = await this.roomRepository.aggregate([{
            $match:object
        },{
            $lookup: {
                from: 'games',
                localField: 'gameId',
                foreignField: '_id',
                as: 'gameData',
              },
        }
    ])
    return{
        success:true,
        message:"All Room",
        data:allRooms
    }
    }
}
