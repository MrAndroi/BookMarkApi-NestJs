import { RoleAction } from "@prisma/client"
import { Exclude, Expose } from "class-transformer"
import * as moment from "moment"
import { I18nContext } from "nestjs-i18n"

export class RoleHistoryEntity {

    constructor(partial: Partial<RoleHistoryEntity>, options) {
        Object.assign(this, partial)
    }
    applier: string
    appliedOn: string
    action: RoleAction

    @Expose({ name: "time" })
    get getTime() {
        let creationDateFormatted = moment(this.createdAt)
        let creationDate = creationDateFormatted.calendar()
        return creationDate

    }

    @Exclude()
    createdAt

}