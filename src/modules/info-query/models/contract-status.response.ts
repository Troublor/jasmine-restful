import Response from "./../../common/models/response.model";
import {ApiProperty} from "@nestjs/swagger";
import {ContractEvent} from "./transaction-info.response";

export class MintEventParams {
    @ApiProperty()
    from!: "0x0000000000000000000000000000000000000000";

    @ApiProperty()
    to!: string;

    @ApiProperty()
    value!: string;
}

export class MintEvent extends ContractEvent {
    @ApiProperty({
        type: MintEventParams,
        description: "a special type of Transfer event which mint new ERC20 tokens",
    })
    params!: MintEventParams;

    @ApiProperty()
    name!: "Mint";
}

export class ContractStatus {
    @ApiProperty({
        type: String,
        description: "name of the ERC20 token",
    })
    name!: string;

    @ApiProperty({
        type: String,
        description: "symbol of the ERC20 token",
    })
    symbol!: string;

    @ApiProperty({
        type: Number,
        description: "decimals used by the ERC20 token",
    })
    decimals!: number;

    @ApiProperty({
        type: String,
        description: "address of the ERC20 contract",
    })
    address!: string;

    @ApiProperty({
        type: String,
        description: "total supply of the ERC20 token",
    })
    totalSupply!: string;

    @ApiProperty({
        type: [MintEvent],
        description: "token mint events",
    })
    mintEvents!: MintEvent[];
}

export default class ContractStatusResponse extends Response {
    @ApiProperty({
        type: ContractStatus,
    })
    data!: ContractStatus | null;

};
