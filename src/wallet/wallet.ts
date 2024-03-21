import { CreateOtherUserDetails, CreateUserDetails, FilterDTO } from "src/utils/types";

export interface IWelletService {
    createWellet(id:string);
    addAmountInWallet(data:any,id:string);
    getAmountByUserId(id:string);

}