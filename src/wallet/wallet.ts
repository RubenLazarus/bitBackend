import { CreateOtherUserDetails, CreateUserDetails, FilterDTO } from "src/utils/types";

export interface IWelletService {
    createWellet(id:string);
    addAmountInWallet(data:any,id:any);
    getAmountByUserId(id:string);
    substractAmount(data:any,id:any)

}