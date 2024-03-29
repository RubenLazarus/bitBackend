import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';
import { room } from './room.entity';
import { user } from './user.entity';
import { COLOR } from 'src/utils/constants';
import { participantOrder } from './participantOrder.entity';



export type participantDetails = participant & Document;

@Schema()
export class participant extends CommanDTO {
  @Prop({ type: String, ref: 'rooms'})
  @IsNotEmpty()
  roomId: room
  @Prop({ type: String, ref: 'users'})
  @IsNotEmpty()
  userId: user
  @Prop({ type: [{ type: String, ref: 'participantOrders' }] })
  participantOrderId: participantOrder[];



}

export const participantSchemaFile = SchemaFactory.createForClass(participant);
