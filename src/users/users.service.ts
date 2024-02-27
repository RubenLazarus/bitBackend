import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, userDetails } from 'src/entities/user.entity';
import { Roles } from 'src/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(user.name) private userRepository: Model<userDetails>,
  ) {}
  getUserCount(mobileNo: string) {
    return this.userRepository.count({ mobileNo: mobileNo });
  }
  getUserByMobileNO(mobileNo: string) {
    return this.userRepository.findOne({ mobileNo: mobileNo });
  }
  getUserCountByRefCode(refCode: string) {
    return this.userRepository.count({ uniqueCode:refCode });
  }

  async createUser(userDetails) {
    try {
      let user: any = {
        firstName:userDetails?.firstName,
        lastName:userDetails?.lastName,
        email:userDetails?.email?.toLowerCase(),
        displayName:userDetails?.displayName,
        passwordHash:userDetails?.passwordHash,
        createdAt:new Date(),
        role:Roles.USER,
        refrenceCode:userDetails?.refrenceCode,
       
      };
      user.uniqueCode=(`${userDetails?.firstName[0]}${userDetails.lastName}${await this.generateUniqueReferenceCode(5,userDetails)}`).toString()
      let addNewUser = await this.userRepository.create(user);
      return addNewUser;
    } catch (error) {
      console.log(error)

    }

  }
  
  async createOtherUser(userDetails) {
    let user: any = {};
    user.firstName = userDetails.firstName;
    user.lastName = userDetails.lastName;
    user.email = userDetails.email?.toLowerCase();
    user.displayName = `${userDetails.firstName} ${userDetails.lastName}`;
    user.passwordHash = userDetails.passwordHash;
    user.createdAt = new Date();
    user.role = userDetails?.role;
    user.refrenceCode = userDetails?.refrenceCode;
    user.uniqueCode = `${userDetails?.firstName[0]}.${
      userDetails.lastName
    }${await this.generateUniqueReferenceCode(5,userDetails)}`;
    const addNewUser = await this.userRepository.create({ ...user });
    return addNewUser;
  }

  getAllUser(filters) {
    try {
      for (const key in filters) {
        if (
          filters.hasOwnProperty(key) &&
          (filters[key] === null ||
            filters[key] === undefined ||
            filters[key] === '')
        ) {
          delete filters[key];
        }
        var pageNumber = 1;
        var pageSize = 0;
        if (filters?.pageNumber) {
          pageNumber = filters.pageNumber;
        }
        if (filters?.pageSize) {
          pageSize = filters.pageSize;
        }
  
        var searchFilters = [];
        searchFilters.push(
          { isDeleted: false },
          { isActive: true }
        );
      }
    } catch (e) {
      throw new HttpException(
        { success: false, message: e?.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //  user Generate Reference Section
  async generateReferenceCode(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }
  async generateUniqueReferenceCode(length,userDetails) {
    let code = await this.generateReferenceCode(length);
    while (! await this.isReferenceCodeUnique(code,userDetails)) {
      code = await this.generateReferenceCode(length);
    }
    return code.toString();
  }
  async isReferenceCodeUnique(code,userDetails) {
    let count = await this.userRepository.count({ uniqueCode: `${userDetails?.firstName[0]}${userDetails.lastName}${code}` });
    if (count > 0) {
      return false;
    }
    return true;
  }
}
