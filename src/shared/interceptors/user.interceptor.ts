//  this interceptor will be used by the custom param decoratro to fetch the current User
import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private prisma: PrismaService) { }
    // handler refers to the route handler
    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        if (userId) {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            });
            console.log("UserFound  "  + user)
            // we need to pass this down to the decorator. SO we assign the user to request because req can be retrieved inside the decorator
            // ------THIS IS WHAT YOU WANTED--------
            request.currentUser = user;
        }
        console.log("UserNotFound  " + userId)
        // run the actual route handler
        return handler.handle();
    }
}