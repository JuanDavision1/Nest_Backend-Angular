import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt:JwtService,private serviceauth:AuthService){}
 async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(token)
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }
    try {
      const payload = await this.jwt.verifyAsync(
        token,{secret: process.env.JWT_SEED  }
      
        );
        const user = await this.serviceauth.finduserbyid(payload.id);
         if(!user) throw new UnauthorizedException('User doesnt exist');
         if(!user.isActive) throw new UnauthorizedException('User not active');

        request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }

 
   
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
