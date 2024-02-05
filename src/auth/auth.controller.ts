import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto,UpdateAuthDto,LoginDto,RegisterDto } from './dto';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  // se toma los valores se estable que se recibiran como parte del body se llama al servicio con su funcion respectiva
  @Post('/login')
  login(@Body() LoginDto:LoginDto) {
    return this.authService.login(LoginDto);
  }
  @Post('/register')
  register(@Body() RegisterDto:RegisterDto) {
    return this.authService.register(RegisterDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req:Request) {
    const user= req['user'];
    return this.authService.findAll();
  }

@UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req:Request):LoginResponse{
    const user= req['user'] as User;
return {
  token:this.authService.getjwt({id:user._id}),
  user
}
  }
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
//     return this.authService.update(+id, updateAuthDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.authService.remove(+id);
//   }
 }
