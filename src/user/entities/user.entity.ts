import { Exclude, Expose } from "class-transformer"
import * as moment from "moment"

export class UserEntity {

    constructor(partial: Partial<UserEntity>, options) {
        this['lang'] = options.lang
        Object.assign(this, partial)
    }
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
    
    @Expose({ name: "fullName" })
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

    @Expose({ name: "createAt" })
    get getDate() {
        let creationDateFormatted = moment(this.createdAt)
        creationDateFormatted.locale(this.lang)
        let creationDate = creationDateFormatted.fromNow()
        return creationDate

    }

    @Exclude()
    hash: string

    @Exclude()
    lang

    @Exclude()
    createdAt

}