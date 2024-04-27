import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { otp, otpDetails } from 'src/entities/otp.entity';
import { verifyOtp } from 'src/utils/types';
import { UserDetail } from "otpless-node-js-auth-sdk"

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
    async sendOTP(data){
        // await sendOTP(phoneNumber, email, channel, hash, orderId, expiry, otpLength, clientId, clientSecret);
        const today = new Date();
        const resetPasswordExpires = new Date(today);
        resetPasswordExpires.setMinutes(today.getMinutes() + 15);
        const otp = await UserDetail.sendOTP(`91${data?.mobileNo}`,"","SMS","","",60,6,process.env.OTP_CLIENTID,process.env.OTP_CLIENTSECRET,"")
        if(otp?.orderId){
            let otpBody ={
                mobileNo:data?.mobileNo,
                resetPasswordExpires,
                otp:otp?.orderId,
                creatdAt: new Date(),  
            }
            await this.otp.create(otpBody);
        }
       
  
        return otp
    }
    async OTPLessVerify(body){
        try {
            const verify: any = await this.otp
                .find({ mobileNo: body?.mobileNo.toLowerCase() })
                .sort({ creatdAt: -1 });
                // verifyOTP(email, phoneNumber, orderId, otp, clientId, clientSecret)
        const verifiedOTP= await UserDetail.verifyOTP("",`91${body?.mobileNo}`, verify[0].otp, body?.otp, process.env.OTP_CLIENTID, process.env.OTP_CLIENTSECRET);
        if(verifiedOTP?.verifiedOTP){
            await this.otp.deleteMany({ mobileNo: body?.mobileNo });
        }



     

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
}
