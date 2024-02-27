import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/Guards/jwt.guard';
import { Routes, Services } from 'src/utils/constants';
import { IUserService } from './users';
import { FilterDTO } from 'src/utils/types';

@Controller(Routes.USERS)
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @Inject(Services.USERS)
    private readonly UserService: IUserService,
  ) {}

  @Post('getAllUsers')
  async getAllUsers( @Body() body: FilterDTO) {
    return await this.UserService.getAllUser(body);
  }
  @Post('createOtherUser')
  async createOtherUser( @Body() body) {
    return await this.UserService.createOtherUser(body);
  }
}
