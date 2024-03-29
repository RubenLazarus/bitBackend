import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';
import { room } from './room.entity';
import { user } from './user.entity';
import { COLOR } from 'src/utils/constants';



export type participantOrderDetails = participantOrder & Document;

@Schema()
export class participantOrder extends CommanDTO {
  @Prop({ type: String, ref: 'rooms'})
  @IsNotEmpty()
  roomId: room
  @Prop({ type: String, ref: 'users'})
  @IsNotEmpty()
  userId: user
  @Prop({type:String,enum:COLOR})
  @IsNotEmpty()
  color:COLOR
  @Prop()
  bitAmount:number
  @Prop()
  bitNumber:number
  @Prop()
  contractCount:number
  @Prop()
  actualAmount:number



}

export const participantOrderSchemaFile = SchemaFactory.createForClass(participantOrder);
