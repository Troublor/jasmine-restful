import Response from "../../common/models/response.model";
import {ApiProperty} from "@nestjs/swagger";

export default class EthTransferResponse extends Response<{
    txHash: string,
} | null> {
    @ApiProperty({
        type: "object",
        properties: {
            txHash: {
                type: "string",
            },
        },
    })
    data!: { txHash: string } | null;
};
