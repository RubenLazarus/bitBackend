import { CreateOtherUserDetails, CreateUserDetails, FilterDTO } from "src/utils/types";

export interface IUserService {
getUserCountByRefCode(refrenceCode: any);
createUser(userDetails:CreateUserDetails)
createOtherUser(userDetails:CreateOtherUserDetails)
getUserCount(email:string)
getAllUser(userData:FilterDTO)
getUserByEmail(email)
}