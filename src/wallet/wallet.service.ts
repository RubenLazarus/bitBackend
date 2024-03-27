import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { transaction, transactionDetails } from 'src/entities/transaction.entity';
import { wallet, walletDetails } from 'src/entities/wallet.entity';
import { PaymentMode, TNXStatus, TNXType } from 'src/utils/constants';

@Injectable()

export class WalletService {
    constructor(
        @InjectModel(transaction.name) private transactionRepository: Model<transactionDetails>,
        @InjectModel(wallet.name) private walletRepository: Model<walletDetails>,
        private readonly events: EventEmitter2,
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
        try {
            let object: any = {
                userId: id,
                tnxAmount: data?.amount,
                tnxType: TNXType?.CREDIT,
                paymentMode: PaymentMode.WALLET,
                createdAt: new Date()

            }
            let ammountAdded = await this.walletRepository.findOneAndUpdate({ userId: id }, { $inc: { amount: data?.amount } }, { new: true })
            if (!ammountAdded) {
                object.tnxStatus = TNXStatus.FAILED
            } else {
                object.tnxStatus = TNXStatus.SUCCESS
                object.walletId = ammountAdded?._id
            }
            await this.createTransition(object)

            this.events.emit('wallet.amount',ammountAdded)
            return {
                success: true,
                message: "Amount has been added",
                data: ammountAdded

            }

        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }

    }
    async substractAmount(data, id) {
        try {
            let object: any = {
                userId: id,
                tnxAmount: data?.bitAmount,
                tnxType: TNXType?.DEBIT,
                paymentMode: PaymentMode.WALLET,
                createdAt: new Date()

            }
            let walletAmount = await this.walletRepository.findOne({ userId: id });
            if (!walletAmount) {
                return {
                    success: false,
                    message: "Insufficesnt Amount"
                }
            }
            if (data?.bitAmount > walletAmount?.amount) {
                return {
                    success: false,
                    message: "Insufficesnt Amount"
                }
            }

            let ammountSubstract = await this.walletRepository.findOneAndUpdate({ userId: id }, { $inc: { amount: -data?.bitAmount } }, { new: true })
            if (!ammountSubstract) {
                object.tnxStatus = TNXStatus.FAILED
            } else {
                object.tnxStatus = TNXStatus.SUCCESS
                object.walletId = ammountSubstract?._id
            }
            await this.createTransition(object);
            this.events.emit('wallet.amount',ammountSubstract)
            return {
                success: true,
                message: "Amount has been Deducted",
                data: ammountSubstract

            }
        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }


    }
    async getAmountByUserId(id) {
        let wallet = await this.walletRepository.findOne({ userId: id })
        return {
            success: true,
            message: "Amount has been Found",
            data: wallet

        }
    }
    async getTnxByUserId(filters,id) {
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
                { isActive: true },
                { userId: id }
              );
              if(filters?.role){
                searchFilters.push({role:filters?.role})
              }
        
            const tnxCount = await this.transactionRepository
            .find({ $and: searchFilters })
            .countDocuments();
        var numberOfPages = pageSize === 0 ? 1 : Math.ceil(tnxCount / pageSize);
        const tnxList = await this.transactionRepository.aggregate([
            { $match: { $and: searchFilters } },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize ? pageSize : Number.MAX_SAFE_INTEGER },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    userId: 1,
                    tnxStatus: 1,
                    tnxAmount: 1,
                    tnxType: 1,
                    role: 1,
                    paymentMode: 1,
                    walletId: 1,
      
                }
            }
        ]);
        return {
            success: true,
            message: "Transaction List",
            tnxList,
            numberOfPages,
        };
          } catch (e) {
            throw new HttpException(
              { success: false, message: e?.message },
              HttpStatus.BAD_REQUEST,
            );
          }
        
    }
    async createTransition(data: any) {
        try {
            return this.transactionRepository.create(data)

        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
