import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { participant, participantDetails } from 'src/entities/participant.entity';
import { participantOrder, participantOrderDetails } from 'src/entities/participantOrder.entity';
import { COLOR, Services, roomStatus } from 'src/utils/constants';
import { IWelletService } from 'src/wallet/wallet';

@Injectable()
export class ParticipantService {
    constructor(
        @InjectModel(participant.name) private participantRepository: Model<participantDetails>,
        @InjectModel(participantOrder.name) private participantOrderRepository: Model<participantOrderDetails>,
        private readonly events: EventEmitter2,
        @Inject(Services.WALLET)
        private readonly walletService: IWelletService,
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
            color: data?.color,
            bitAmount: data?.bitAmount?parseInt(data?.bitAmount):null,
            roomId: data?.roomId,
            userId: id,
            bitNumber: data?.bitNumber?parseInt(data?.bitNumber):null
        }
        let walletAmount = await this.walletService.substractAmount(data,id)
        if(!walletAmount?.success){
            return walletAmount
        }
        let order = await this.participantOrderRepository.create(object)
        return {
            success:true,
            message:"order crearted",
            data:order
        }

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
    async getTotalAmountByRoomId(data){
        let totalAmount = await this.participantOrderRepository.aggregate([{
            $match:{roomId:data?.roomId}
        },
    {
        $group:{_id:null,sum:{$sum:"$bitAmount"}}
    }
    ]);
    console.log(totalAmount)
    return {
        success:true,
        message:"Total amount",
        data:totalAmount
    }
    }
    async sendMoneyToAllWinner(data){
        let findAllParticipant = this.participantOrderRepository.find({roomId:data?._id});
        for await (const iterator of findAllParticipant) {
         if(iterator?.color){
            if(data?.winColor.includes(iterator?.color)){
                switch(iterator?.color){
                    case COLOR.RED :{
                        if(data?.winNumber%2 == 0 && data?.winNumber !=0){
                            let data={
                                amount:(iterator?.bitAmount * 2).toFixed(2)

                            }
                            await this.walletService.addAmountInWallet(data,iterator?.userId)
                        }
                        if(data?.winNumber%2 == 0 && data?.winNumber == 0){
                            let data={
                                amount:(iterator?.bitAmount * 1.5).toFixed(2)

                            }
                            await this.walletService.addAmountInWallet(data,iterator?.userId)
                        }
                    }
                    case COLOR.BLUE :{
                        if(data?.winNumber%2 != 0 && data?.winNumber !=5){
                            let data={
                                amount:(iterator?.bitAmount * 2).toFixed(2)

                            }
                            await this.walletService.addAmountInWallet(data,iterator?.userId)
                        }
                        if(data?.winNumber%2 != 0 && data?.winNumber == 5){
                            let data={
                                amount:(iterator?.bitAmount * 1.5).toFixed(2)

                            }
                            await this.walletService.addAmountInWallet(data,iterator?.userId)
                        }
                    }
                    case COLOR.GREEN :{
                        if(data?.winNumber == 0 || data?.winNumber == 5){
                            let data={
                                amount:(iterator?.bitAmount * 4.5).toFixed(2)

                            }
                            await this.walletService.addAmountInWallet(data,iterator?.userId)
                        }
                    }
                }
            }
         }
         if(iterator?.bitNumber){
            if(iterator?.bitNumber == data?.winNumber)
            {
                let data={
                    amount:(iterator?.bitAmount * 9.8).toFixed(2)

                }
                await this.walletService.addAmountInWallet(data,iterator?.userId)   
            }
         }
            
        }
    }
}
