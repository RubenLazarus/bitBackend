import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { CommanDTO } from "src/dtos/comman.dto";
import { user } from "./user.entity";

export type walletDetails = wallet & Document;
@Schema()
export class wallet extends CommanDTO {
    @Prop({ type: String, ref: 'users'})
    @IsNotEmpty()
    userId: user
    @Prop()
    amount:number
  
}
export const walletSchemaFile = SchemaFactory.createForClass(wallet);