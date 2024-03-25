import { Request } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

export interface CustomRequest extends Request {
  user?: UserRequest;
}

export interface UserRequest
  extends Pick<User, '_id' | 'email' | 'roles' | 'username'> {}

// Archivo donde defines la extensión del objeto Request
// import { Request } from 'express';
// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload;
//     }
//   }
// }
