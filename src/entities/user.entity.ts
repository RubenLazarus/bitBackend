import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommanDTO } from 'src/dtos/comman.dto';
import { Roles } from 'src/utils/constants';
export type userDetails = user & Document;

@Schema()
export class user extends CommanDTO {
  @Prop()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  displayName: string;

  @Prop()
  mobileNo: string;

  @Prop({ type: String, enum: Roles, default: Roles.USER })
  role: Roles;

  @Prop()
  refrenceCode: string;
  @Prop()
  uniqueCode: string;

  @Prop({ default: null })
  passwordHash: string;

  @Prop()
  salt: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  passwordExpDate: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  profileImage: string;
  @Prop({ default: false })
  isVerifiedByAdmin: boolean;
}

export const userSchemaFile = SchemaFactory.createForClass(user);


