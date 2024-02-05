import { IsEmail, MinLength } from "class-validator";
//esto es como que parametros recibire desde el front para validarlos en el back
//ir a al auth.controller.ts
export class LoginDto{
    @IsEmail()
    email:string;
    @MinLength(6)
    password:string;
}