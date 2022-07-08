import { Body, Controller, Post } from "@nestjs/common";
import { ApiHeader, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthService } from "./auth.service";
import { AuthSignInDto, AuthSignUpDto } from "./dto";

@ApiHeader({
    name: 'localization',
    description: 'Add localization (ar-en) default en',
    required: false,
})
@ApiTags('Authentication')
@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService) { }

    @Throttle(3, 60)
    @Post("sign_up")
    signUp(
        @Body() body: AuthSignUpDto,
        @I18n() i18n: I18nContext,
    ) {
        return this.authService.signUp(body, i18n)
    }

    @Throttle(3, 60)
    @Post("sign_in")
    signIn(
        @Body() body: AuthSignInDto,
        @I18n() i18n: I18nContext,
    ) {
        return this.authService.signIn(body, i18n)
    }

}