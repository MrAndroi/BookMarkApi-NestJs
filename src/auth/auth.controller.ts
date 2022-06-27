import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post("sign_up")
    signUp(@Body() body: AuthDto) {
        return this.authService.signUp(body)
    }

    @Post("sign_in")
    signIn(@Body() body: AuthDto) {
        return this.authService.signIn(body)
    }

}