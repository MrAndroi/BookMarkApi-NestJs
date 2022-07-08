import { Exclude, Expose } from "class-transformer"

export class UserMediaEntity {

    constructor(partial: Partial<UserMediaEntity>, options) {
        Object.assign(this, partial)
    }
    id: number
    url: string
    @Exclude()
    createdAt: string
}