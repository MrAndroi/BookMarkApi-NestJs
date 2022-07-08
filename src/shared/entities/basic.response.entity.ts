export class BasicResponse {
    constructor(partial: Partial<BasicResponse>, options) {
        Object.assign(this, partial)
    }
    data: boolean
}

export class BasicResponseList{
    constructor(partial: Partial<BasicResponse>, options) {
        Object.assign(this, partial)
    }
    data: any[]
}