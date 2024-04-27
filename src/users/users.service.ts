import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user, userDetails } from 'src/entities/user.entity';
import { Roles, Services } from 'src/utils/constants';
import * as bcrypt from 'bcrypt';
import { IWelletService } from 'src/wallet/wallet';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(user.name) private userRepository: Model<userDetails>,
    @Inject(Services.WALLET) private walletService: IWelletService,
  ) { }
  getUserCount(mobileNo: string) {
    return this.userRepository.count({ mobileNo: mobileNo });
  }
  getUserByMobileNO(mobileNo: string) {
    return this.userRepository.findOne({ mobileNo: mobileNo });
  }
  getUserCountByRefCode(refCode: string) {
    return this.userRepository.count({ uniqueCode: refCode });
  }

  async createUser(userDetails) {
    try {
      let user: any = {
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        mobileNo: userDetails?.mobileNo?.toLowerCase(),
        displayName: userDetails?.displayName,
        passwordHash: userDetails?.passwordHash,
        createdAt: new Date(),
        role: Roles.USER,
        refrenceCode: userDetails?.refrenceCode,

      };
      user.uniqueCode = (`${userDetails?.firstName[0]}${userDetails.lastName}${await this.generateUniqueReferenceCode(5, userDetails)}`).toString()
      let addNewUser = await this.userRepository.create(user);
      return addNewUser;
    } catch (e) {
      throw new HttpException(
        { success: false, message: e?.message },
        HttpStatus.BAD_REQUEST,
      );

    }

  }

  async createOtherUser(userDetails) {
    try {
      const passwordHash = bcrypt.hashSync(
        userDetails.password,
        bcrypt.genSaltSync(10),
      );
      let user: any = {};
      user.firstName = userDetails.firstName;
      user.lastName = userDetails.lastName;
      user.mobileNo = userDetails.mobileNo?.toLowerCase();
      user.displayName = `${userDetails.firstName} ${userDetails.lastName}`;
      user.passwordHash = passwordHash;
      user.createdAt = new Date();
      user.role = userDetails?.role;
      user.refrenceCode = userDetails?.refrenceCode;
      user.uniqueCode = (`${userDetails?.firstName[0]}${userDetails.lastName}${await this.generateUniqueReferenceCode(5, userDetails)}`).toString()
      let addNewUser = await this.userRepository.create(user);
      const addWallet = await this.walletService.createWellet(addNewUser?._id)
      return {
        success:true,
        message:"User has been created",
        data:addNewUser
      };
    } catch (e) {
      throw new HttpException(
        { success: false, message: e?.message },
        HttpStatus.BAD_REQUEST,
      );
    }

  }

  async getAllUser(filters) {
    try {
      for (const key in filters) {
        if (
          filters.hasOwnProperty(key) &&
          (filters[key] === null ||
            filters[key] === undefined ||
            filters[key] === '')
        ) {
          delete filters[key];
        }    }
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
        if(filters?.role){
          searchFilters.push({role:filters?.role})
        }
  
      const roomsCount = await this.userRepository
      .find({ $and: searchFilters })
      .countDocuments();
  var numberOfPages = pageSize === 0 ? 1 : Math.ceil(roomsCount / pageSize);
  const roomsList = await this.userRepository.aggregate([
      { $match: { $and: searchFilters } },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize ? pageSize : Number.MAX_SAFE_INTEGER },
      {
          $project: {
              _id: 1,
              createdAt: 1,
              firstName: 1,
              lastName: 1,
              displayName: 1,
              mobileNo: 1,
              role: 1,
              uniqueCode: 1,
              isActive: 1,

          }
      }
  ]);
  return {
      success: true,
      message: "Order List",
      roomsList,
      numberOfPages,
  };
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
  async generateUniqueReferenceCode(length, userDetails) {
    let code = await this.generateReferenceCode(length);
    while (! await this.isReferenceCodeUnique(code, userDetails)) {
      code = await this.generateReferenceCode(length);
    }
    return code.toString();
  }
  async isReferenceCodeUnique(code, userDetails) {
    let count = await this.userRepository.count({ uniqueCode: `${userDetails?.firstName[0]}${userDetails.lastName}${code}` });
    if (count > 0) {
      return false;
    }
    return true;
  }

  async verifyUser(mobileNo) {
    return await this.userRepository.findOneAndUpdate({ mobileNo: mobileNo.toString() }, { $set: { isVerified: true } }, { new: true })
  }
  async updatePassword(data){
    return await this.userRepository.findOneAndUpdate({ mobileNo: data?.mobileNo.toString() }, { $set: { passwordHash: data?.passwordHash } }, { new: true })
  }
}
