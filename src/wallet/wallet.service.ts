import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { transaction, transactionDetails } from 'src/entities/transaction.entity';
import { wallet, walletDetails } from 'src/entities/wallet.entity';

@Injectable()

export class WalletService {
    constructor(
        @InjectModel(transaction.name) private transactionRepository: Model<transactionDetails>,
        @InjectModel(wallet.name) private walletRepository: Model<walletDetails>,
    ) { }
    async createWellet(id) {
        let object = {
            amount: 0,
            userId: id
        }
        let wallet = await this.walletRepository.create(object)
        return {
            success: true,
            data: wallet
        }
    }
    async addAmountInWallet(data, id) {

        let ammountAdded = await this.walletRepository.updateOne({ userId: id }, { $inc: { amount: data?.amount } }, { new: true })
        return {
            success: true,
            message: "Amount has been added",
            data: ammountAdded

        }
    }
    async getAmountByUserId(id){
        let wallet = await this.walletRepository.findOne({userId:id})
        return {
            success: true,
            message: "Amount has been Found",
            data: wallet

        }
    }

}
