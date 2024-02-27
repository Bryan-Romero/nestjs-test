import { Request } from 'express';
import { UserDocument } from 'src/user/entities/user.entity';

export interface CustomRequest extends Request {
  user?: UserRequest;
}

export interface UserRequest
  extends Pick<UserDocument, '_id' | 'email' | 'roles' | 'username'> {
  refresh_token?: string;
}

// Archivo donde defines la extensión del objeto Request
// import { Request } from 'express';
// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload;
//     }
//   }
// }
