import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';
import { game } from './game.entity';
import { roomStatus } from 'src/utils/constants';



export type luckyHitRoomDetails = luckyHitRoom & Document;

@Schema()
export class luckyHitRoom extends CommanDTO {
  @Prop({ type: String, ref: 'games'})
  @IsNotEmpty()
  gameId: game

  @Prop({type:String,enum:roomStatus,default:roomStatus.UPCOMING})
  @IsNotEmpty()
  status:roomStatus
  @Prop()
  startTime:Date
  @Prop()
  endTime:Date
  @Prop()
  totalAmount:number
  @Prop()
  winColor:Array<string>
  @Prop()
  Black:Array<string>
  @Prop()
  Red:Array<string>
  @Prop()
  Reason:string
  @Prop({type:Boolean,default:true})
  isContinue:boolean
}

export const luckyHitRoomSchemaFile = SchemaFactory.createForClass(luckyHitRoom);
