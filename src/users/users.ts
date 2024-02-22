import { CreateOtherUserDetails, CreateUserDetails, FilterDTO } from "src/utils/types";

export interface IUserService {
createUser(userDetails:CreateUserDetails)
createOtherUser(userDetails:CreateOtherUserDetails)
getUserCount(email:string)
getAllUser(userData:FilterDTO)
}