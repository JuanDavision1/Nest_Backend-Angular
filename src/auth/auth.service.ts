import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModelito: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userdata } = CreateUserDto;

      //Encriptar la contraseña.
      const newUser = new this.UserModelito({
        password: bcryptjs.hashSync(password, 10),
        ...userdata,
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${CreateUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something happend!!');
    }
  }
async register(RegisterDto:RegisterDto):Promise<LoginResponse>{
const usuariocreado= await this.create(RegisterDto);

return{
  user: usuariocreado,
token : this.getjwt({id: usuariocreado._id})
}
}

  async login(LoginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = LoginDto;
    const user = await this.UserModelito.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Not valid credentials');
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials-pass');
    }
    const { password: _, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getjwt({ id: user.id }),
    };

  }


  findAll():Promise<User[]>  {
    return this.UserModelito.find();
  }

 async finduserbyid(id:string){
const user = await this.UserModelito.findById(id);
const  {password,...resto} =user.toJSON();
return resto;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getjwt(payload: JWTPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
