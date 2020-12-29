import PaginateResponseModel, {PaginateData} from "../../common/models/paginate-response.model";
import {ApiProperty} from "@nestjs/swagger";

export abstract class ContractEvent<EventParams extends Record<string, any>> {
    @ApiProperty({
        description: "parameters of the event",
    })
    abstract params: EventParams;

    @ApiProperty({
        type: String,
        description: "event name",
    })
    name!: string;

    @ApiProperty({
        type: String,
        description: "hash of the transaction that this event belongs to",
    })
    txHash!: string;

    @ApiProperty({
        type: String,
        description: "hash of the block that this event belongs to",
    })
    blockHash!: string;

    @ApiProperty({
        type: Number,
        description: "number (height) of the block that this event belongs to",
    })
    blockNumber!: number;
}

export class EventListData<EventParameter> extends PaginateData {
    events!: ContractEvent<EventParameter>[]
}

export class TransferEventParams implements Record<string, any> {
    from!: string;
    to!: string;
    value!: string;
}

export default class EventListResponse<EventParams> extends PaginateResponseModel<EventListData<EventParams>> {
    @ApiProperty({type: EventListData})
    data!: EventListData<EventParams> | null;
};
