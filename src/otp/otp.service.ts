import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { otp, otpDetails } from 'src/entities/otp.entity';
import { verifyOtp } from 'src/utils/types';

@Injectable()
export class OtpService {
    @InjectModel(otp.name) private otp: Model<otpDetails>
    constructor() { }
    async generateOTP() {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        return otp;
    }
    async otpVerfications(body: verifyOtp) {
        try {
            const verify: any = await this.otp
                .find({ mobileNo: body?.mobileNo.toLowerCase() })
                .sort({ creatdAt: -1 });
            if (verify[0]?.otp != body?.otp) {
                return {
                    success: false,
                    statuCode: 403,
                    message: 'OTP not matched or incorrect',
                };
            }
            const currentDate = new Date();
            //OTP expier in 10 min
            if (currentDate > verify[0].resetPasswordExpires) {
                return {
                    success: false,
                    statuCode: 403,
                    message: 'OTP not matched or incorrect',
                };
            }
            await this.otp.deleteMany({ mobileNo: body?.mobileNo });

            return {
                success: true,
                message: 'OTP verified',
            };
        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async createOTP(body){
        const {OTP,mobileNo}= body
        try {
            const today = new Date();
            const resetPasswordExpires = new Date(today);
            resetPasswordExpires.setMinutes(today.getMinutes() + 15);

            let object = {
                mobileNo,
                resetPasswordExpires,
                otp:OTP,
                creatdAt: new Date(),
              };
             return await this.otp.create(object);
        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
