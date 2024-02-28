import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';



export type otpDetails = otp & Document;

@Schema()
export class otp {
  @Prop()
  @IsNotEmpty()
  otp: string

  @Prop()
  @IsNotEmpty()
  mobileNo: string

  @Prop()
  resetPasswordExpires: Date;
  
  @Prop()
  creatdAt: Date;

}

export const otpSchemaFile = SchemaFactory.createForClass(otp);
