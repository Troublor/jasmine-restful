import Response from "./response.model";
import {ApiProperty} from "@nestjs/swagger";

export abstract class PaginateData {
    metadata!: {
        page: number,
        pageItems: number,
        numPages: number,
        totalItems: number,
    }
}

export default class PaginateResponseModel<T extends PaginateData = PaginateData> extends Response<PaginateData | null> {
    @ApiProperty({type: PaginateData})
    data!: T | null;
};
