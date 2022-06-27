import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService){}

    async signUp(body:AuthDto){
        //Generate hash for password
        const hash = await argon.hash(body.password)

        //Save user To Postgres db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: body.email,
                    hash: hash,
                    firstName: body.firstName,
                    lastName: body.lastName
                }
            })
    
            //Return saved user data
            return user
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException("Already Taken Email")
                }
                return error
            }
        }
    }

    async signIn(body:AuthDto){
        //Find the user 
        const user = await this.prisma.user.findUnique({
            where:{
                email: body.email
            }
        })

        //Check if the user exists
        if(!user) throw new ForbiddenException("Incorrect Credentials")

        //Compare passwords
        const isPasswordMatches = await argon.verify(user.hash,body.password)

        //Check if user enter correct password
        if(isPasswordMatches) { 
            delete user.hash
            return user
         }
        else throw new ForbiddenException("Incorrect Credentials")

    }

}