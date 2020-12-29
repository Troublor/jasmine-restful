import {ApiProperty} from "@nestjs/swagger";
import Response from "../../common/models/response.model";

export class Transaction {
    @ApiProperty({
        type: String,
        description: "transaction hash",
    })
    hash!: string;

    @ApiProperty({
        type: String,
        description: "hash of the block containing the transaction",
    })
    blockHash!: string | null;

    @ApiProperty({
        type: Number,
        description: "height of the block containing the transaction",
    })
    blockHeight!: number | null;
    @ApiProperty({
        type: Number,
        description: "nonce of the transaction",
    })
    nonce!: number;

    @ApiProperty({
        type: Number,
        description: "index of this transaction in the block",
    })
    transactionIndex!: number | null;

    @ApiProperty({
        type: String,
        description: "sender address",
    })
    from!: string;

    @ApiProperty({
        type: String,
        description: "destination address",
    })
    to!: string | null;

    @ApiProperty({
        type: String,
        description: "value of the transaction",
    })
    value!: string;

    @ApiProperty({
        type: Number,
        description: "gas used in this transaction",
    })
    gasUsed!: number | null;

    @ApiProperty({
        type: String,
        description: "gas price",
    })
    gasPrice!: string;

    @ApiProperty({
        type: String,
        description: "input of the transaction",
    })
    input!: string;

    @ApiProperty({
        type: Boolean,
        description: "execution status of the transaction, true means the transaction is successful",
    })
    status!: boolean | null;
}

export default class TransactionResponse extends Response<Transaction> {
    @ApiProperty({type: Transaction})
    data!: Transaction | null;
};
