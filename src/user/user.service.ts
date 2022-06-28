import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma:PrismaService){}

    getUserData(user:UserDto){
        return user
    }

    async updateUserData(user:UserDto,userId:number){
        let updated = false
        try{
            updated = await this.prisma.user.update({
                where:{
                    id:userId
                },
                data:user
            }) != null
            return {data:updated}
        } catch{
            return {data:updated}
        }
    }
}
