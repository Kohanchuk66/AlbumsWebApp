import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
    login: string;
    email: string;
    @IsNotEmpty()
    password: string;
}
export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  login: string;
}