import { ValidateUserDetails } from 'src/utils/types';

export interface IAuthService {
  validateUser(userDetails: ValidateUserDetails);
  signUpUser(User: any);
  login(data:any);
  VerifyOTP(data);
  forgotPassword(mobileNo:string)
  OTPverification(data)
}
