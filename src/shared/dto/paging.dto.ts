import { IsOptional } from "class-validator";

export class PagingParamsDto {
    @IsOptional()
    page: number = 0

    @IsOptional()
    limit: number = 10
}

export class PagingResponse {
    data: any[]
    nextKey: number
    prevKey: number
    isNext: boolean

    constructor(data:any,nextKey:number,prevKey:number,isNext:boolean){
        this.data = data
        this.nextKey = nextKey
        this.prevKey = prevKey
        this.isNext = isNext
    }
}

