import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';
import { room } from './room.entity';
import { user } from './user.entity';
import { COLOR } from 'src/utils/constants';



export type participantDetails = participant & Document;

@Schema()
export class participant extends CommanDTO {
  @Prop({ type: String, ref: 'rooms'})
  @IsNotEmpty()
  roomId: room
  @Prop({ type: String, ref: 'users'})
  @IsNotEmpty()
  userId: user
  @Prop({type:String,enum:COLOR})
  @IsNotEmpty()
  color:COLOR



}

export const participantSchemaFile = SchemaFactory.createForClass(participant);
