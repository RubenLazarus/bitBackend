import { Socket } from 'socket.io';
import { user } from 'src/entities/user.entity';
export interface AuthenticatedSocket extends Socket {
  user?: user;
}
