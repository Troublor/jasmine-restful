import Response from "../../common/models/response.model";
import {ApiProperty} from "@nestjs/swagger";

export class BalanceResponse extends Response {
    @ApiProperty({
        type: "object",
        properties: {
            address: {
                type: "hex",
            },
        },
    })
    data!: {
        balance: string
    } | null;
}
