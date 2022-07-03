import { Exclude, Expose } from "class-transformer"
import * as moment from "moment"

export class UserEntity {
    id: number
    email: string
    firstName: string
    lastName: string
    createdAt: string
    creationDate: string

    @Exclude()
    hash: string

    @Expose({ name: "fullName" })
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

    set creationDateWithMoment(lang: string) {
        let creationDateFormatted = moment(this.createdAt)
        creationDateFormatted.locale(lang)
        this.creationDate = creationDateFormatted.fromNow()
    }

}