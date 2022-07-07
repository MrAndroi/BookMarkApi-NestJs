import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AuthModule { }