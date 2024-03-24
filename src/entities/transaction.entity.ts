import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";
import { CommanDTO } from "src/dtos/comman.dto";
import { user } from "./user.entity";
export type transactionDetails = transaction & Document;

@Schema()
export class transaction extends CommanDTO {
    @Prop({ type: String, ref: 'users'})
    @IsNotEmpty()
    userId: user
    @Prop()
    tnxAmount:number
    @Prop()
    tnxStatus:string
    @Prop()
    tnxNumber:string
    @Prop()
    tnxType:string
    @Prop()
    paymentMode:string
    @Prop({ type: String, ref: 'wallets'})
    walletId:string

  
}
export const transactionSchemaFile = SchemaFactory.createForClass(transaction);

