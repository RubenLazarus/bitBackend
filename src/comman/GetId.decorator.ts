import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
export const GetId = createParamDecorator(
  (id: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request['headers']['authorization']?.replace('Bearer','')?.trim()
    const decoded:any = token?jwt.decode(token):undefined;    
    return decoded?._id
  },
);
export const Role = createParamDecorator(
  (id: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request['headers']['authorization']?.replace('Bearer','')?.trim()
    const decoded:any = token?jwt.decode(token):undefined;    
    return decoded?.role
  },
);