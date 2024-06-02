import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { otp, otpDetails } from 'src/entities/otp.entity';
import { verifyOtp } from 'src/utils/types';
import { UserDetail } from "otpless-node-js-auth-sdk"
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OtpService {
    @InjectModel(otp.name) private otp: Model<otpDetails>
    constructor(private httpservice: HttpService) { }
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
        // console.log(process.env.OTP_CLIENTID,process.env.OTP_CLIENTSECRET)
        let body ={
            "phoneNumber": `91${data?.mobileNo}`,
            "channel": "SMS",
            "otpLength": 4,
            "expiry": 360
          }
       
        let otp:any= await firstValueFrom(
            this.httpservice
              .post(
                `https://auth.otpless.app/auth/otp/v1/send`,
                body,{
                    headers: {
                        "Content-Type":"application/json",
                        "clientId":"BI1L7SZCVKXRZ4KAZCYE7096VDZA5KGA",
                        "clientSecret":"ez7zv0yyllnz3u2r2zvdt09304uv1yzr"
                    }
                }
              ));
        // const otp = await UserDetail.sendOTP(`91${data?.mobileNo}`,"rubenlazarus19@gmail.com","SMS","","",60,6,process.env.OTP_CLIENTID,process.env.OTP_CLIENTSECRET)
        if(otp.data?.orderId){
            let otpBody ={
                mobileNo:data?.mobileNo,
                resetPasswordExpires,
                otp:otp.data?.orderId,
                creatdAt: new Date(),  
            }
            const otp1 = await this.otp.create(otpBody);
            // console.log(otp1)
        }
       
  
        return otp.data
    }
    async OTPLessVerify(body){
        try {
            const verify: any = await this.otp
                .find({ mobileNo: body?.mobileNo.toLowerCase() })
                .sort({ creatdAt: -1 });
                // verifyOTP(email, phoneNumber, orderId, otp, clientId, clientSecret)
        // const verifiedOTP= await UserDetail.verifyOTP("",`91${body?.mobileNo}`, verify[0].otp, body?.otp, process.env.OTP_CLIENTID, process.env.OTP_CLIENTSECRET);
     let obj ={
        orderId:verify[0].otp,
        otp:body?.otp,
        phoneNumber:`91${body?.mobileNo}`

     }
        let verifiedOTP:any= await firstValueFrom(
            this.httpservice
              .post(
                `https://auth.otpless.app/auth/otp/v1/verify`,
                obj,{
                    headers: {
                        "Content-Type":"application/json",
                        "clientId":"BI1L7SZCVKXRZ4KAZCYE7096VDZA5KGA",
                        "clientSecret":"ez7zv0yyllnz3u2r2zvdt09304uv1yzr"
                    }
                }
              ));
        if(verifiedOTP?.data?.isOTPVerified){
            await this.otp.deleteMany({ mobileNo: body?.mobileNo });
        }
        if(!verifiedOTP.data?.isOTPVerified){
            return {
                success :false,
                message:"Unable to Verify OTP Please Try again letar"
            }
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
