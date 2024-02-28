import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from 'src/dtos/user.dto';
import { loginUserDetails } from 'src/utils/types';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}

  @Post('register')
  async registerUser(@Body() createUserDTO: CreateUserDto) {
    return await this.authService.signUpUser(createUserDTO);
  }
  @Post('login')
  async login(@Body() loggedInUser:loginUserDetails){
    return await this.authService.login(loggedInUser)

  }
  @Post('VerifyOTP')
  async VerifyOTP(@Body() loggedInUser:loginUserDetails){
    return await this.authService.VerifyOTP(loggedInUser)

  }
}
