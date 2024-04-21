import { game, gameSchemaFile } from "src/entities/game.entity";
import { luckyHitRoom, luckyHitRoomSchemaFile } from "src/entities/luckyhitRoom.entity";
import { luckyHitParticipant, luckyHitParticipantSchemaFile } from "src/entities/luckyhitparticipant.entity";
import { luckyHitParticipantOrder, luckyHitParticipantOrderSchemaFile } from "src/entities/luckyhitparticipantOrder.entity";
import { otp, otpSchemaFile } from "src/entities/otp.entity";
import { participant, participantSchemaFile } from "src/entities/participant.entity";
import { participantOrder, participantOrderSchemaFile } from "src/entities/participantOrder.entity";
import { room, roomSchemaFile } from "src/entities/room.entity";
import { transaction, transactionSchemaFile } from "src/entities/transaction.entity";
import { user, userSchemaFile } from "src/entities/user.entity";
import { wallet, walletSchemaFile } from "src/entities/wallet.entity";


export const entities = [
    { name: user.name, schema: userSchemaFile },
    { name: otp.name, schema: otpSchemaFile },
    { name: game.name, schema: gameSchemaFile },
    { name: room.name, schema: roomSchemaFile },
    { name: participant.name, schema: participantSchemaFile },
    { name: luckyHitParticipant.name, schema: luckyHitParticipantSchemaFile },
    { name: luckyHitParticipantOrder.name, schema: luckyHitParticipantOrderSchemaFile },
    { name: participantOrder.name, schema: participantOrderSchemaFile },
    { name: transaction.name, schema: transactionSchemaFile },
    { name: wallet.name, schema: walletSchemaFile },
    { name: luckyHitRoom.name, schema: luckyHitRoomSchemaFile },
]