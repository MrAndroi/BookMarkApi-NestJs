import { Exclude, Expose } from "class-transformer"
import * as moment from "moment"

export class BookmarkEntity {

    constructor(partial: Partial<BookmarkEntity>, options) {
        this['isSavedByUser'] = options.isSavedByUser
        Object.assign(this, partial)
    }

    id: number
    title: string
    link: string
    description: string
    role: string

    isSavedByUser: boolean

    @Exclude()
    createdAt: string

    @Exclude()
    userId: number

}