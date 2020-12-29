import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import EthereumService from "./ethereum.service";
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import Response, {ResponseGenerator} from "../common/models/response.model";
import {Tags} from "../common/tags";
import Erc20Service from "./erc20.service";
import ManagerService from "./manager.service";
import EthTransferDto from "./models/eth-transfer.dto";
import BN from "bn.js";
import EthTransferResponse from "./models/eth-transfer.response";
import TransactionResponse from "./models/transaction.response";
import HashPipe from "./pipes/hash.pipe";
import {BalanceResponse} from "./models/balance.response";
import AddressPipe from "./pipes/address.pipe";
import {Address} from "jasmine-eth-ts";

@Controller("ethereum")
@ApiTags(Tags.ETHEREUM)
export default class EthereumController {
    constructor(
        private readonly ethereumService: EthereumService,
        private readonly erc20Service: Erc20Service,
        private readonly managerService: ManagerService,
    ) {
    }

    @Get("endpoint")
    @ApiOperation({summary: "Get Ethereum endpoint URL"})
    @ApiBadRequestResponse({description: "Invalid query parameters"})
    @ApiOkResponse({
        schema: {
            type: "object",
            properties: {
                endpoint: {
                    type: "object", properties: {
                        http: {type: "string"},
                        ws: {type: "string"},
                    },
                },
            },
        },
    })
    public getEndpoint(): Response<{ endpoint: { ws: string, http: string } }> {
        return ResponseGenerator.OK({
            endpoint: this.ethereumService.getEndpoint(),
        });
    }

    @Get("config")
    @ApiOperation({summary: "Get Ethereum configuration"})
    @ApiBadRequestResponse({description: "Invalid query parameters"})
    @ApiOkResponse({
        schema: {
            type: "object",
            properties: {
                endpoint: {
                    type: "object",
                    properties: {
                        http: {type: "string"},
                        ws: {type: "string"},
                    },
                },
                contracts: {
                    type: "object",
                    properties: {
                        manager: {type: "string"},
                        erc20: {type: "string"},
                    },
                },
            },
        },
    })
    public getConfig(): Response<{ endpoint: { ws: string, http: string }, contracts: { manager: string, erc20: string } }> {
        return ResponseGenerator.OK({
            endpoint: this.ethereumService.getEndpoint(),
            contracts: {
                manager: this.managerService.getAddress(),
                erc20: this.erc20Service.getAddress(),
            },
        });
    }


    @Post("transfer")
    @ApiOperation({summary: "Transfer ETH"})
    @ApiOkResponse({type: EthTransferResponse})
    @ApiBadRequestResponse({description: "Invalid post data"})
    public async postDepositTransactionFee(
        @Body() ethTransferDto: EthTransferDto
    ): Promise<EthTransferResponse> {
        try {
            const amount = new BN(ethTransferDto.amount);
            const txHash = await this.ethereumService.transfer(ethTransferDto.recipient, amount, ethTransferDto.privateKey);
            return ResponseGenerator.OK({
                txHash: txHash,
            });
        } catch (e) {
            return ResponseGenerator.BadRequest(e.message);
        }
    }

    @Get("balance-of/:address")
    @ApiOperation({summary: "Get ETH balance of an Ethereum address"})
    @ApiBadRequestResponse({description: "Invalid address"})
    @ApiOkResponse({type: BalanceResponse})
    public async getBalanceOf(
        @Param("address", AddressPipe) address: Address
    ): Promise<BalanceResponse> {
        const balance = await this.ethereumService.balanceOf(address);
        const resp = {
            balance: "0x" + balance.toString("hex"),
        };
        return ResponseGenerator.OK(resp);
    }

    @Get("transaction/:txHash")
    @ApiOperation({summary: "get detailed information of a transaction"})
    @ApiParam({name: "txHash", type: String})
    @ApiOkResponse({type: TransactionResponse})
    @ApiBadRequestResponse({description: "invalid hash"})
    @ApiNotFoundResponse({description: "transaction not found"})
    public async getTransaction(
        @Param("txHash", HashPipe) txHash: string,
    ) {
        const tx = await this.ethereumService.getTransaction(txHash);
        return ResponseGenerator.OK(tx);
    }
};
