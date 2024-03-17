import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { game, gameDetails } from 'src/entities/game.entity';

@Injectable()
export class GameService {
    constructor( 
        @InjectModel(game.name) private gameRepository: Model<gameDetails>
        )
    {}
    async createGame(data){
        if(!(data && data?.name)){
            return {
                success:false,
                message :"Please send Name"
            }
        }
     let createdData = await this.gameRepository.create(data)
     if(!createdData){
        return {
            success:false,
            message:"Unable to Create game"
        }
     }
     return {
        success:true,
        message:"Game has been created",
        data:createdData
     }
    }
    async getAllGame(){
        let allGames = await this.gameRepository.find({isActive:true,isDeleted:false})
        return {
            success :true,
            message:"Gell all messages",
            gameList:allGames
        }
    }
    async getGameByName(name){
        let game = await this.gameRepository.findOne({"name":name})
        if(!game){
            return {
                success:false,
                message:"Game Not Found"
            }
        }
        return {
            success:true,
            message:"Game  Found",
            data:game
        }
    }
}
