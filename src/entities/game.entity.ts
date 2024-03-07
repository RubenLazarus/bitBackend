import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';



export type gameDetails = game & Document;

@Schema()
export class game extends CommanDTO {
  @Prop()
  @IsNotEmpty()
  name: string

}

export const gameSchemaFile = SchemaFactory.createForClass(game);
