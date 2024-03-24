import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUserService } from 'src/users/users';
import { Services } from 'src/utils/constants';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IOTPService } from 'src/otp/otp';
import { smsService } from 'src/comman/sms.service';
import { IWelletService } from 'src/wallet/wallet';
@Injectable()
export class AuthService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.OTP) private otpService: IOTPService,
    @Inject(Services.WALLET) private walletService: IWelletService,
    private smsService: smsService
  ) { }
  async validateUser(user: any): Promise<any> {
    return user;
  }
  async createAccessToken(data: any) {
    const privateKey = process.env.JWT_ACCESS_TOKEN_SECRET;
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRE;

    const payload = {
      email: data?.email,
      _id: data?._id,
      mobileNo: data?.mobileNo,
      firstName: data?.firstName,
      lastName: data?.lastName,
      displayName: data?.displayName
        ? data?.displayName
        : `${data?.firstName} ${data?.lastName}`,
    };
    const userInfo = data;
    delete userInfo._doc?.salt;
    delete userInfo._doc?.passwordHash;
    delete userInfo._doc?.creatdAt;

    return {
      data: userInfo,
      success: true,
      accessToken: jwt.sign(payload, privateKey, {
        algorithm: 'HS256',
        expiresIn,
      }),
    };
  }
  async signUpUser(User: any) {
    try {
      const validateUser = await this.userService.getUserCount(User?.mobileNo);
      if (validateUser > 0) {
        return { message: 'User Already exist', success: false };
      }
      if(User?.refrenceCode){
        const validRefCode: any = await this.userService.getUserCountByRefCode(User?.refrenceCode)
        if (validRefCode == 0) {
          return { message: 'RefrenceCode Does not Exist', success: false };
        }
      }
    

      User.mobileNo = User?.mobileNo?.toLowerCase();
      const passwordHash = bcrypt.hashSync(
        User.password,
        bcrypt.genSaltSync(10),
      );
      let userObject: any = {
        mobileNo: User?.mobileNo?.toLowerCase(),
        displayName: User?.displayName
          ? User?.displayName
          : `${User?.firstName} ${User?.lastName}`,
        firstName: User?.firstName,
        lastName: User?.lastName,
        passwordHash,
        refrenceCode: User?.refrenceCode?User?.refrenceCode:null,
        creatdAt: new Date(),
      };

      const newOTP = await this.otpService.generateOTP()
      const addNewuser = await this.userService.createUser(userObject);
      let OTPBody = {
        OTP: newOTP,
        mobileNo: User.mobileNo
      }

const addWallet = await this.walletService.createWellet(addNewuser?._id)
      const isSMSSend = await this.smsService.sentSMS(addNewuser, newOTP)
      if (isSMSSend) {
        await this.otpService.createOTP(OTPBody)
      }

      if (addNewuser) {
        const loginDetails = await this.createAccessToken(addNewuser);

        // OTP



        return Object.assign(loginDetails, {
          success: true,
          message: 'OTP send To Your Mobile number',
        });
      }
      return {
        success: false,
        massage: 'Unable to Register New User',
      };
    } catch (e) {
      throw new HttpException(
        { success: false, message: e?.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async login(data: any) {
    try {
      const { username, password } = data;
      let checkUser = await this.userService.getUserByMobileNO(username);
      if (!checkUser) {
        return {
          success: false,
          message: "Incorrect username or password"
        }
      }

      if (
        !checkUser ||
        checkUser?.isDeleted == true

      ) {
        // this.logger.warn(`${data.username} is try to logIn`)
        return { success: false, message: 'Incorrect username or password' };
      }
      if (checkUser?.isActive == false) {
        return { success: false, message: 'Your credentials has been deactivated by the superadmin' };
      }
      const mathPassword = bcrypt.compareSync(
        password,
        checkUser?.passwordHash,
      );
      if (mathPassword === false) {
        return { success: false, message: 'Incorrect username or password' };
      }
      // let creatFCM:any
      // if(data?.notification_token){
      //   creatFCM = await this.notificationService.createNotificationToken({userId:checkUser._id,notification_token:data?.notification_token})
      // }
      const loginDetails = await this.createAccessToken(checkUser);
      // const obj={
      //   user:loginDetails?.data?._id,
      //   title:"user Locked in",
      //   body:"User has been locked in pleace check"
      // }
      // await this.notificationService.sendPush(obj)
      return Object.assign(loginDetails, {
        success: true,
        isUserExists: true,
        message: 'User exists',
      });


    } catch (error) {
      console.log(error)
    }
  }
  async VerifyOTP(data: any){

     const optData = await this.otpService.otpVerfications(data)
     if(optData?.success){
      const userInfo = await this.userService.verifyUser(data?.mobileNo)
      if(userInfo){
        const loginDetails = await this.createAccessToken(userInfo);
        return Object.assign(loginDetails, {
          success: true,
          message: 'User has been verified',
        });
      }
     }
     return {
      success: false,
      massage: 'unable to verify otp',
    };
  }
  
}
