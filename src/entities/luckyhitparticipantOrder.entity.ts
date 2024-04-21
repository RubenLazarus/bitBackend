import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';
import { user } from './user.entity';
import { COLORLUCKYHIT } from 'src/utils/constants';
import { luckyHitRoom } from './luckyhitRoom.entity';



export type luckyHitParticipantOrderDetails = luckyHitParticipantOrder & Document;

@Schema()
export class luckyHitParticipantOrder extends CommanDTO {
  @Prop({ type: String, ref: 'luckyhitrooms'})
  @IsNotEmpty()
  roomId: luckyHitRoom
  @Prop({ type: String, ref: 'users'})
  @IsNotEmpty()
  userId: user
  @Prop({type:String,enum:COLORLUCKYHIT})
  @IsNotEmpty()
  color:COLORLUCKYHIT
  @Prop()
  bitAmount:number
  @Prop()
  contractCount:number
  @Prop()
  actualAmount:number



}

export const luckyHitParticipantOrderSchemaFile = SchemaFactory.createForClass(luckyHitParticipantOrder);
