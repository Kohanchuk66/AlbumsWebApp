import dotenv from "dotenv";
import {sign} from "jsonwebtoken"

dotenv.config ();

export class AuthService {
    static signPayload(payload: object, time: string) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: time });
    }
}
