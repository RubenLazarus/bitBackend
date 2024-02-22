import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from 'src/dtos/user.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}

  @Post('register')
  async registerUser(@Body() createUserDTO: CreateUserDto) {
    return await this.authService.signUpUser(createUserDTO);
  }
}
