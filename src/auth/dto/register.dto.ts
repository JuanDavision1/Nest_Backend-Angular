import { IsEmail, IsString, MinLength } from "class-validator";
//esto es como que parametros recibire desde el front para validarlos en el back
//ir a al auth.controller.ts
export class RegisterDto{
    @IsEmail()
    email:string;
    @IsString()
    name:string;
    @MinLength(6)
    password:string;
}