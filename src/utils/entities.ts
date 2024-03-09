import { game, gameSchemaFile } from "src/entities/game.entity";
import { otp, otpSchemaFile } from "src/entities/otp.entity";
import { participant, participantSchemaFile } from "src/entities/participant.entity";
import { room, roomSchemaFile } from "src/entities/room.entity";
import { user, userSchemaFile } from "src/entities/user.entity";


export const entities = [
    { name: user.name, schema: userSchemaFile },
    { name: otp.name, schema: otpSchemaFile },
    { name: game.name, schema: gameSchemaFile },
    { name: room.name, schema: roomSchemaFile },
    { name: participant.name, schema: participantSchemaFile },
]