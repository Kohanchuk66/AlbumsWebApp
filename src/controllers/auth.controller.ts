import {
    Controller,
    Post,
    Body,
    HttpCode,
    Res
} from 'routing-controllers';
import 'reflect-metadata';
import express from "express";
import { Md5 } from "md5-typescript";

import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";
import { User } from "../types/user";
import { AuthService } from "../services/auth.service";

@Controller()
export class AuthController {
    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginDTO: LoginDTO, @Res() res: express.Response) {
        try {
            const { email, password, login } = loginDTO;
            const emailRegex = new RegExp(/^\S+@\S+\.\S+$/);
            let user;

            if (email && !emailRegex.test(email)){
                return res.status(400).json({
                    message: 'Provide correct email!'
                });
            }

            if (email){
                user = await User.findOne({email});
            }
            else
                user = await User.findOne({login});

            if (!user)
                return res.status(401).json({
                    message: 'Email or login is incorrect!'
                });

            if (!(Md5.init(password) == user.password))
                return res.status(401).json({
                    message: 'Wrong password!'
                });

            const payload = {
                userID: user._id,
            };
            const token = AuthService.signPayload(payload, "24h");

            return {
                accessToken: `Bearer ${token}`
            };
        }
        catch (e){
            return res.status(500).json({
                message: 'Something went wrong!'
            });
        }
    }

    @Post('/register')
    @HttpCode(200)
    async register(@Body() loginDTO: RegisterDTO, @Res() res: express.Response) {
        try {
            const { email, login } = loginDTO;

            const user = await User.findOne({ $or: [ { login }, { email } ] });
            if (user)
                return res.status(400).json({
                    message: 'User with same login or email is already exists!'
                });

            const createdUser = new User({...loginDTO, registerDate: Date.now()});

            await createdUser.save();

            return {message: "User created successfully!"};
        }
        catch (e){
            return res.status(500).json({
                message: 'Something went wrong!'
            });
        }
    }
}