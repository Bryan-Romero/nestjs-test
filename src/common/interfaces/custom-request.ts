import { Request } from 'express';
import { JwtPayload } from './jtw-payload';

// Define un nuevo tipo que extiende el tipo Request de Express
export interface CustomRequest extends Request {
  user?: JwtPayload;
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
