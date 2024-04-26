import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { luckyHitRoom, luckyHitRoomDetails } from 'src/entities/luckyhitRoom.entity';
import { room, roomDetails } from 'src/entities/room.entity';
import { IGameService } from 'src/game/game';
import { IParticipantService } from 'src/participant/participant';
import { COLOR, COLORLUCKYHIT, Services, roomStatus } from 'src/utils/constants';
const deck = [{
    "Value": "A",
    "Rank": 14,
    "Suit": "spades"
}, {
    "Value": "2",
    "Rank": 2,
    "Suit": "spades"
}, {
    "Value": "3",
    "Rank": 3,
    "Suit": "spades"
}, {
    "Value": "4",
    "Rank": 4,
    "Suit": "spades"
},
{
    "Value": "5",
    "Rank": 5,
    "Suit": "spades"
},
{
    "Value": "6",
    "Rank": 6,
    "Suit": "spades"
},
{
    "Value": "7",
    "Rank": 7,
    "Suit": "spades"
},
{
    "Value": "8",
    "Rank": 8,
    "Suit": "spades"
},
{
    "Value": "9",
    "Rank": 9,
    "Suit": "spades"
},
{
    "Value": "10",
    "Rank": 10,
    "Suit": "spades"
},
{
    "Value": "J",
    "Rank": 11,
    "Suit": "spades"
},
{
    "Value": "Q",
    "Rank": 12,
    "Suit": "spades"
},
{
    "Value": "K",
    "Rank": 13,
    "Suit": "spades"
},
{
    "Value": "A",
    "Rank": 14,
    "Suit": "diamonds"
},
{
    "Value": "2",
    "Rank": 2,
    "Suit": "diamonds"
},
{
    "Value": "3",
    "Rank": 3,
    "Suit": "diamonds"
},
{
    "Value": "4",
    "Rank": 4,
    "Suit": "diamonds"
},
{
    "Value": "5",
    "Rank": 5,
    "Suit": "diamonds"
},
{
    "Value": "6",
    "Rank": 6,
    "Suit": "diamonds"
},
{
    "Value": "7",
    "Rank": 7,
    "Suit": "diamonds"
},
{
    "Value": "8",
    "Rank": 8,
    "Suit": "diamonds"
},
{
    "Value": "9",
    "Rank": 9,
    "Suit": "diamonds"
},
{
    "Value": "10",
    "Rank": 10,
    "Suit": "diamonds"
},
{
    "Value": "J",
    "Rank": 11,
    "Suit": "diamonds"
},
{
    "Value": "Q",
    "Rank": 12,
    "Suit": "diamonds"
},
{
    "Value": "K",
    "Rank": 13,
    "Suit": "diamonds"
},
{
    "Value": "A",
    "Rank": 14,
    "Suit": "clubs"
},
{
    "Value": "2",
    "Rank": 2,
    "Suit": "clubs"
},
{
    "Value": "3",
    "Rank": 3,
    "Suit": "clubs"
},
{
    "Value": "4",
    "Rank": 4,
    "Suit": "clubs"
},
{
    "Value": "5",
    "Rank": 5,
    "Suit": "clubs"
},
{
    "Value": "6",
    "Rank": 6,
    "Suit": "clubs"
},
{
    "Value": "7",
    "Rank": 7,
    "Suit": "clubs"
},
{
    "Value": "8",
    "Rank": 8,
    "Suit": "clubs"
},
{
    "Value": "9",
    "Rank": 9,
    "Suit": "clubs"
},
{
    "Value": "10",
    "Rank": 10,
    "Suit": "clubs"
},
{
    "Value": "J",
    "Rank": 11,
    "Suit": "clubs"
},
{
    "Value": "Q",
    "Rank": 12,
    "Suit": "clubs"
},
{
    "Value": "K",
    "Rank": 13,
    "Suit": "clubs"
},
{
    "Value": "A",
    "Rank": 14,
    "Suit": "hearts"
},
{
    "Value": "2",
    "Rank": 2,
    "Suit": "hearts"
},
{
    "Value": "3",
    "Rank": 3,
    "Suit": "hearts"
},
{
    "Value": "4",
    "Rank": 4,
    "Suit": "hearts"
},
{
    "Value": "5",
    "Rank": 5,
    "Suit": "hearts"
},
{
    "Value": "6",
    "Rank": 6,
    "Suit": "hearts"
},
{
    "Value": "7",
    "Rank": 7,
    "Suit": "hearts"
},
{
    "Value": "8",
    "Rank": 8,
    "Suit": "hearts"
},
{
    "Value": "9",
    "Rank": 9,
    "Suit": "hearts"
},
{
    "Value": "10",
    "Rank": 10,
    "Suit": "hearts"
},
{
    "Value": "J",
    "Rank": 11,
    "Suit": "hearts"
},
{
    "Value": "Q",
    "Rank": 12,
    "Suit": "hearts"
},
{
    "Value": "K",
    "Rank": 13,
    "Suit": "hearts"
}
]
const crypto = require("crypto");
@Injectable()
export class RoomService {
    constructor(
        @InjectModel(room.name) private roomRepository: Model<roomDetails>,
        @InjectModel(luckyHitRoom.name) private luckyHitRoomRepository: Model<luckyHitRoomDetails>,
        private readonly events: EventEmitter2,
        @Inject(Services.GAME)
        private readonly gameService: IGameService,
        @Inject(Services.PARTICIPANT)
        private readonly paticipantService: IParticipantService,
    ) { }
    async createRoom(data) {
        let currentTime = new Date()
        let object = {
            gameId: data.gameId,
            status: roomStatus?.CONTINUE,
            createdAt: currentTime,
            startTime: currentTime,
            endTime: (currentTime.getTime() + data?.time * 60000)
        }
        let createdRoom = await this.roomRepository.create(object)
        this.events.emit('color.newroom', {
            success: true,
            message: "New Room is created",
            data: createdRoom
        })
        return {
            success: true,
            message: "New Room is created",
            data: createdRoom
        }
    }
    async changeStatus(data) {
        if (!data?.roomId) {
            return {
                success: false,
                message: "Room id is required",
            }

        }
        if (!Object.values(roomStatus).includes(data?.status)) {
            return {
                success: false,
                message: "status is unknow"
            }
        }
        let object: any = {}
        if (data?.status == roomStatus?.COMPLEDTED) {
            object.status = roomStatus?.COMPLEDTED
        }
        if (data?.status == roomStatus?.PENDING) {
            object.status = roomStatus?.PENDING
        }
        if (data?.isContinue == false) {
            object.isContinue = false
        }


        let updataedStatus = await this.roomRepository.findByIdAndUpdate(data?.roomId, {
            $set: object
        }, { new: true })
        console.log('announced.update_ststus HIT')
        this.events.emit('announced.update_ststus', updataedStatus)
        return {
            success: true,
            message: "changes Update",
            data: updataedStatus
        }
    }
    async getAllRooms(filters) {
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
            }
            if (!filters?.gameId) {
                return {
                    success: false,
                    message: "Plese send Game Id"

                }
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
                { isActive: true },
                { gameId: filters?.gameId }
            );
            if (filters?.status) {
                searchFilters.push({ userStatus: filters?.status });
            }

            const roomsCount = await this.roomRepository
                .find({ $and: searchFilters })
                .countDocuments();
            var numberOfPages = pageSize === 0 ? 1 : Math.ceil(roomsCount / pageSize);
            const roomsList = await this.roomRepository.aggregate([
                { $match: { $and: searchFilters } },
                { $sort: { createdAt: -1 } },
                { $skip: (pageNumber - 1) * pageSize },
                { $limit: pageSize ? pageSize : Number.MAX_SAFE_INTEGER },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        startTime: 1,
                        endTime: 1,
                        totalAmount: 1,
                        winColor: 1,
                        winNumber: 1,

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
    async getActiveRooms() {
        try {
            let activeRoom = await this.roomRepository.findOne({ isContinue: true })
            return {
                success: true,
                message: "Active Room",
                activeRoom
            };
        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }
    }


    @Cron('* * * * * *')
    async regulateColorGame() {

        let room: any = await this.roomRepository.findOne({ isContinue: true })
        let game: any = await this.gameService.getGameByName('Color Game')
        if (!room) {

            if (game?.success) {
                let object = {
                    gameId: game?.data?._id,
                    time: 3
                }
                await this.createRoom(object)
                return;
            }
        }
        const currentTime = new Date();
        const thirtySecondsAgo = new Date(new Date(room?.endTime).getTime() - 30 * 1000);
        // console.log(`${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`, `${thirtySecondsAgo.getHours()}:${thirtySecondsAgo.getMinutes()}:${thirtySecondsAgo.getSeconds()}`, "new " + `${thirtySecondsAgo.getSeconds() + 1}`)
        if (currentTime.getHours() == thirtySecondsAgo.getHours() && currentTime.getMinutes() == thirtySecondsAgo.getMinutes() && (currentTime.getSeconds() == thirtySecondsAgo.getSeconds() || currentTime.getSeconds() == thirtySecondsAgo.getSeconds() + 1)) {
            let data = {
                roomId: room?._id,
                status: roomStatus.PENDING
            }
            await this.changeStatus(data)
        }
        if (currentTime > new Date(room?.endTime)) {
            let data = {
                roomId: room?._id,
                status: roomStatus.PENDING,
                isContinue: false
            }
            // await this.changeStatus(data)
            const randomNumber = Math.floor(Math.random() * 10);
            const randomColorKey = Object.keys(COLOR)[Math.floor(Math.random() * Object.keys(COLOR).length)];
            const randomColorValue = COLOR[randomColorKey];
            let dataSubmit = {
                roomId: room?._id,
                winColor: randomColorValue,
                winNumber: randomNumber
            }
            await this.submitResult(dataSubmit)
        }

    }


    async submitResult(data) {
        if (!data?.roomId) {
            return {
                success: false,
                message: "please send Room Id"
            }
        }
        let totalAmount = await this.paticipantService.getTotalAmountByRoomId(data);


        let object = {
            totalAmount: totalAmount?.data?.length > 0 ? totalAmount?.data[0]?.sum : 0,
            winColor: data?.winColor,
            winNumber: data?.winNumber,
            isContinue: false,
            status: roomStatus.COMPLEDTED
        }
        let updateroom = await this.roomRepository.findByIdAndUpdate(data?.roomId, { $set: object }, { new: true })

        this.paticipantService.sendMoneyToAllWinner(updateroom)
        this.events.emit('announced.result', updateroom)
        return {
            success: true,
            message: "Result",
            data: updateroom
        }
    }
 


    //  Lucky Hit section
    async createluckyHitRoom(data) {
        let currentTime = new Date()
        let object = {
            gameId: data.gameId,
            status: roomStatus?.CONTINUE,
            createdAt: currentTime,
            startTime: currentTime,
            endTime: (currentTime.getTime() + data?.time * 60000)
        }
        let createdRoom = await this.luckyHitRoomRepository.create(object)
        this.events.emit('luckyhit.newroom', {
            success: true,
            message: "New Room is created",
            data: createdRoom
        })
        return {
            success: true,
            message: "New Room is created",
            data: createdRoom
        }
    }
    @Cron('* * * * * *')
    async regulateLuckyHitGame() {

        let luckyHitroom: any = await this.luckyHitRoomRepository.findOne({ isContinue: true })
        let game: any = await this.gameService.getGameByName('Lucky Hit')
        if (!luckyHitroom) {

            if (game?.success) {
                let object = {
                    gameId: game?.data?._id,
                    time: 0.5
                }
                await this.createluckyHitRoom(object)
                return;
            }
        }
        const currentTime = new Date();
        const thireeSecondsAgo = new Date(new Date(luckyHitroom?.endTime).getTime() + 3 * 1000);
        // console.log(currentTime,"currentdate")
        // console.log(`${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`, `${thirtySecondsAgo.getHours()}:${thirtySecondsAgo.getMinutes()}:${thirtySecondsAgo.getSeconds()}`, "new " + `${thirtySecondsAgo.getSeconds() + 1}`)
        if (currentTime > new Date(luckyHitroom?.endTime) && luckyHitroom?.status ===roomStatus?.CONTINUE) {
            // let data = {
            //     luckyHitroomId: luckyHitroom?._id,
            //     status: roomStatus.PENDING
            // }
            // console.log(currentTime,"Pending")
            let winner = await this.generateCards()
            // console.log(winner, "winner")

            let dataSubmit = {
                roomId: luckyHitroom?._id,
                winColor: winner,

            }
            await this.submitResultForLuckyHit(dataSubmit)
            // await this.changeStatusluckyHit(data)
        }
        if (currentTime>thireeSecondsAgo && luckyHitroom?.status ===roomStatus?.PENDING) {
            let data = {
                roomId: luckyHitroom?._id,
                status: roomStatus.COMPLEDTED,
                isContinue: false
            }
            // console.log(currentTime,thireeSecondsAgo,"COMPLEDTED")
            await this.changeStatusluckyHit(data)
     
        }

    }
    async changeStatusluckyHit(data) {
        if (!data?.roomId) {
            return {
                success: false,
                message: "Room id is required",
            }

        }
        if (!Object.values(roomStatus).includes(data?.status)) {
            return {
                success: false,
                message: "status is unknow"
            }
        }
        let object: any = {}
        if (data?.status == roomStatus?.COMPLEDTED) {
            object.status = roomStatus?.COMPLEDTED
        }
        if (data?.status == roomStatus?.PENDING) {
            object.status = roomStatus?.PENDING
        }
        if (data?.isContinue == false) {
            object.isContinue = false
        }


        let updataedStatus = await this.luckyHitRoomRepository.findByIdAndUpdate(data?.roomId, {
            $set: object
        }, { new: true })
        console.log('announced.update_status lucky HIT')
        this.events.emit('announced.update_status_lucky_hit', updataedStatus)
        return {
            success: true,
            message: "changes Update",
            data: updataedStatus
        }
    }
    async getActiveluckyHitRooms() {
        try {
            let activeRoom = await this.luckyHitRoomRepository.findOne({ isContinue: true })
            return {
                success: true,
                message: "Active Room",
                activeRoom
            };
        } catch (e) {
            throw new HttpException(
                { success: false, message: e?.message },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    isNumber(char) {
        return !isNaN(char)
    }
    async createDeck() {
        var suits = ["spades", "diamonds", "clubs", "hearts"];
        var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let deck = new Array();

        for (let i = 0; i < suits.length; i++) {
            for (let x = 0; x < values.length; x++) {
                let card: any = { Value: values[x], Suit: suits[i] };
                if (values[x] == "A") {
                    card.Rank = 14
                }
                if (values[x] == "J") {
                    card.Rank = 11
                }
                if (values[x] == "Q") {
                    card.Rank = 12
                }
                if (values[x] == "K") {
                    card.Rank = 13
                }
                if (await this.isNumber(values[x])) {
                    card.Rank = parseInt(values[x])
                }

                deck.push(card);
            }
        }

        return deck;
    }

    async generateCards() {
        let deckCard = await this.createDeck()
        let Red = [], Black = [];
        let Redcount = 0, Blackcount = 0;
        let object: any;
        // console.log(deckCard, deckCard.length, "2")
        let deckOfCard = deckCard;
        Red = [];
        Black = [];
        Redcount = 0;
        Blackcount = 0
        for (let i = 0; i < 6; i++) {
            // console.log(deckOfCard,deckOfCard.length,"3")
            if (deckOfCard.length === 0) {
                console.log("No cards left in the deck.");
                return;
            }

            // Generate a random index within the range of remaining cards
            const randomIndex = crypto.randomInt(0, deckOfCard.length);

            // Remove and return the card at the random index
            const poppedCard = deckOfCard.splice(randomIndex, 1)[0];
            if (i % 2 == 0) {
                Black.push(poppedCard);
                Blackcount += poppedCard?.Rank
            } else {
                Red.push(poppedCard)
                Redcount += poppedCard?.Rank
            }

        }


        object = {
            Red: Red,
            Black: Black
        }
        let result = await this.logicCheck(Black, Red)

        return result
    }
    async shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    async logicCheck(black, Red) {

        let winner = await this.gameRules(black, Red)
        return winner
    }

    async gameRules(black, Red) {
        let rankBlack = await this.getRank(black)
        let rankRed = await this.getRank(Red)
        console.log(rankBlack, rankRed)
        if (rankBlack?.rank < rankRed?.rank) {


            return Object.assign({ Black: black, Red: Red, winner: "Black", Reason: rankBlack?.resion }, { message: "Black win" });
        } else if (rankRed?.rank < rankBlack?.rank) {
            return Object.assign({ Black: black, Red: Red, winner: "Red", Reason: rankRed?.resion }, { message: "Red win" });
        } else {
            let maxBlack = black.reduce((total, obj) => {
                return total + obj.Rank;
            }, 0);
            let maxRed = Red.reduce((total, obj) => {
                return total + obj.Rank;
            }, 0);
            if (maxBlack > maxRed) {
                return Object.assign({ Black: black, Red: Red, winner: "Black", Reason: rankBlack?.resion }, { message: "Black win" });
            } else if (maxRed > maxBlack) {
                return Object.assign({ Black: black, Red: Red, winner: "Red", Reason: rankRed?.resion }, { message: "Red win" });
            } else {
                this.generateCards()
            }

        }
    }

    async getRank(hand) {
        let rank = 0;
        let resion = ""

        // Sort the hand by rank and suit
        hand.sort((a, b) => a.Rank - b.Rank);
        console.log(hand)

        // Check for Trio
        if (hand[0]['Value'] === hand[1]['Value'] && hand[1]['Value'] === hand[2]['Value']) {
            rank = 1;
            resion = "Win By Trio"
        }

        // Check for Pure Sequence
        else if (
            (hand[0]['Value'] === '2' && hand[1]['Value'] === '3' && hand[2]['Value'] === '4' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '3' && hand[1]['Value'] === '4' && hand[2]['Value'] === '5' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '4' && hand[1]['Value'] === '5' && hand[2]['Value'] === '6' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '5' && hand[1]['Value'] === '6' && hand[2]['Value'] === '7' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '6' && hand[1]['Value'] === '7' && hand[2]['Value'] === '8' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '7' && hand[1]['Value'] === '8' && hand[2]['Value'] === '9' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '8' && hand[1]['Value'] === '9' && hand[2]['Value'] === '10' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '9' && hand[1]['Value'] === '10' && hand[2]['Value'] === 'J' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === '10' && hand[1]['Value'] === 'J' && hand[2]['Value'] === 'Q' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === 'J' && hand[1]['Value'] === 'Q' && hand[2]['Value'] === 'K' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) ||
            (hand[0]['Value'] === 'Q' && hand[1]['Value'] === 'K' && hand[2]['Value'] === 'A' && hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit'])
        ) {
            rank = 2;
            resion = "Win By Pure Sequence"
        }

        // Check for Sequence
        else if (
            (hand[0]['Value'] === '2' && hand[1]['Value'] === '3' && hand[2]['Value'] === '4') ||
            (hand[0]['Value'] === '3' && hand[1]['Value'] === '4' && hand[2]['Value'] === '5') ||
            (hand[0]['Value'] === '4' && hand[1]['Value'] === '5' && hand[2]['Value'] === '6') ||
            (hand[0]['Value'] === '5' && hand[1]['Value'] === '6' && hand[2]['Value'] === '7') ||
            (hand[0]['Value'] === '6' && hand[1]['Value'] === '7' && hand[2]['Value'] === '8') ||
            (hand[0]['Value'] === '7' && hand[1]['Value'] === '8' && hand[2]['Value'] === '9') ||
            (hand[0]['Value'] === '8' && hand[1]['Value'] === '9' && hand[2]['Value'] === '10') ||
            (hand[0]['Value'] === '9' && hand[1]['Value'] === '10' && hand[2]['Value'] === 'J') ||
            (hand[0]['Value'] === '10' && hand[1]['Value'] === 'J' && hand[2]['Value'] === 'Q') ||
            (hand[0]['Value'] === 'J' && hand[1]['Value'] === 'Q' && hand[2]['Value'] === 'K') ||
            (hand[0]['Value'] === 'Q' && hand[1]['Value'] === 'K' && hand[2]['Value'] === 'A')
        ) {
            rank = 3;
            resion = "Win By Sequence"
        }

        // Check for Same Suit
        else if (hand[0]['Suit'] === hand[1]['Suit'] && hand[1]['Suit'] === hand[2]['Suit']) {
            rank = 4;
            resion = "Win By Same Suit"
        }

        // Check for Two Cards of the Same Rank
        else if (
            (hand[0]['Value'] === hand[1]['Value'] && hand[1]['Value'] !== hand[2]['Value']) ||
            (hand[0]['Value'] !== hand[1]['Value'] && hand[1]['Value'] === hand[2]['Value'])
        ) {
            rank = 5;
            resion = "Win By Two Cards of the Same Rank"
        }

        // Check for High Card
        else {
            rank = 6;
            resion = "High Card"
        }
        let object = {
            rank,
            resion
        };
        return object
    }
    async submitResultForLuckyHit(data) {
        if (!data?.roomId) {
            return {
                success: false,
                message: "please send Room Id"
            }
        }
        let totalAmount = await this.paticipantService.getTotalAmountByRoomIdForLuckyHit(data);


        let object = {
            totalAmount: totalAmount?.data?.length > 0 ? totalAmount?.data[0]?.sum : 0,
            winColor: data?.winColor?.winner,
            Black:data?.winColor?.Black,
            Red:data?.winColor?.Red,
            Reason:data?.winColor?.Reason,
            isContinue: true,
            status: roomStatus.PENDING
        }
        let updateroom = await this.luckyHitRoomRepository.findByIdAndUpdate(data?.roomId, { $set: object }, { new: true })

        this.paticipantService.sendMoneyToAllWinnerAtLuckeyHit(updateroom)
        this.events.emit('announced.result.lucky.hit', updateroom)
        return {
            success: true,
            message: "Result",
            data: updateroom
        }
    }
    async getAllLuckyHitRooms(filters) {
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
            }
            if (!filters?.gameId) {
                return {
                    success: false,
                    message: "Plese send Game Id"

                }
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
                { isActive: true },
                { gameId: filters?.gameId }
            );
            if (filters?.status) {
                searchFilters.push({ userStatus: filters?.status });
            }

            const roomsCount = await this.luckyHitRoomRepository
                .find({ $and: searchFilters })
                .countDocuments();
            var numberOfPages = pageSize === 0 ? 1 : Math.ceil(roomsCount / pageSize);
            const roomsList = await this.luckyHitRoomRepository.aggregate([
                { $match: { $and: searchFilters } },
                { $sort: { createdAt: -1 } },
                { $skip: (pageNumber - 1) * pageSize },
                { $limit: pageSize ? pageSize : Number.MAX_SAFE_INTEGER },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        startTime: 1,
                        endTime: 1,
                        totalAmount: 1,
                        winColor: 1,
                        Black: 1,
                        Red: 1,
                        Reason: 1,

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
}
