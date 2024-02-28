import { otp, otpSchemaFile } from "src/entities/otp.entity";
import { user, userSchemaFile } from "src/entities/user.entity";


export const entities = [
    { name: user.name, schema: userSchemaFile },
    { name: otp.name, schema: otpSchemaFile },
]