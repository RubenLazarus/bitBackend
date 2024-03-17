import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { participant, participantDetails } from 'src/entities/participant.entity';
import { participantOrder, participantOrderDetails } from 'src/entities/participantOrder.entity';

@Injectable()
export class ParticipantService {
    constructor(
        @InjectModel(participant.name) private participantRepository: Model<participantDetails>,
        @InjectModel(participantOrder.name) private participantOrderRepository: Model<participantOrderDetails>,
        private readonly events: EventEmitter2,
    ) { }
    async createParticipant(data, id) {

        let object: any = {
            roomId: data?.roomId,
            userId: id
        }
        let participantData = await this.participantRepository.create(object);
        return {
            success: true,
            message: "new entry",

            data: participantData
        }

    }
    async order(data, id) {

        let object: any = {
            color:data?.color,
            bitAmmount:data?.amount
        }
        let updateUser = await this.participantRepository.findByIdAndUpdate(id,{$set:object},{new:true})
    }
    async getAllParticipantByRoomId(data) {
        let participantList = await this.participantRepository.aggregate([

            {
                $match: {
                    roomId: data?.roomId
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $lookup: {
                    from: "rooms",
                    localField: "roomId",
                    foreignField: "_id",
                    as: "roomData"
                }
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$roomData',
                    preserveNullAndEmptyArrays: true,
                },
            },



        ])
        return {
            success: true,
            meassge: "List of All Participants List",
            data: participantList
        }
    }
}
