import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
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

    async updatePassword(oldPass:string,newPass:string,userId:number){
        //get user 
        const user = await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        //check if old password is match current hash
        let isOldPasswordMatch = await argon.verify(user.hash,oldPass)

        if(isOldPasswordMatch){
            //Generate new password hash
            const newPasswordHash = await argon.hash(newPass)
            //Set new hash to user
            user.hash = newPasswordHash
            //Update user in the data base
            let updated = false
            try{
                updated = await this.prisma.user.update({
                    where:{
                        id:userId
                    },
                    data:{
                        hash:newPasswordHash
                    }
                }) !=  null
                return {updated:updated}
            }
            catch{
                return {updated:updated}
            }

        }
        else{
            throw new ForbiddenException("Old password is incorrect")
        }
    }
}
