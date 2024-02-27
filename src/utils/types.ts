import { Roles } from "./constants";

export type CreateUserDetails = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordHash: string;
    refrenceCode:string;
  };
export type CreateOtherUserDetails = {
    email: string;
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
    email: string;
  };
  export type FilterDTO = Partial<{
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
    dateFrom: Date;
    dateTo: Date;
    userid: string;
  }>;