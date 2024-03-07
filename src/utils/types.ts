import { Roles } from "./constants";

export type CreateUserDetails = {
    mobileNo: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordHash: string;
    refrenceCode:string;
  };
export type CreateOtherUserDetails = {
    mobileNo: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordHash: string;
    refrenceCode:string;
    role:Roles
  };
  export type loginUserDetails = {
    username: string;
    password: string;
  };
  export type ValidateUserDetails = {
    password: string;
    mobileNo: string;
  };
  export type verifyOtp = {
    mobileNo: string;
    otp: string;
  };
  export type FilterDTO = Partial<{
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
    dateFrom: Date;
    dateTo: Date;
    userid: string;
  }>;
  export type createGame={
    name:string;
    imageUrl:string;
  }
  export type updateGame=Partial<{
    name:string;
    imageUrl:string;
  }>
  export type softDeleteGame = {
    _id:string;
  }
  export type hardDeleteGame = {
    _id:string;
  }