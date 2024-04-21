import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, isNotEmpty } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';
import { user } from './user.entity';
import { participantOrder } from './participantOrder.entity';
import { luckyHitParticipantOrder } from './luckyhitparticipantOrder.entity';
import { luckyHitRoom } from './luckyhitRoom.entity';



export type luckyHitParticipantDetails = luckyHitParticipant & Document;

@Schema()
export class luckyHitParticipant extends CommanDTO {
  @Prop({ type: String, ref: 'luckyhitrooms'})
  @IsNotEmpty()
  roomId: luckyHitRoom
  @Prop({ type: String, ref: 'users'})
  @IsNotEmpty()
  userId: user
  @Prop({ type: [{ type: String, ref: 'luckyhitparticipantorders' }] })
  luckyHitParticipantOrderId: luckyHitParticipantOrder[];



}

export const luckyHitParticipantSchemaFile = SchemaFactory.createForClass(luckyHitParticipant);
