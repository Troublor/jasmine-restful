import {ApiProperty} from "@nestjs/swagger";

export default class EthTransferDto {
    @ApiProperty({type: String, description: "sender private key"})
    privateKey!: string

    @ApiProperty({type: "number", description: "amount of ETH to transfer in wei"})
    amount!: string

    @ApiProperty({type: String, description: "recipient address"})
    recipient!: string
};
