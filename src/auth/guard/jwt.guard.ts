import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();       
    
        const isPublic = this.reflector.get<string[]>('isPublic', context.getHandler());
        if (user) return user;
        if (isPublic) return true;
        throw new UnauthorizedException();
      }
}