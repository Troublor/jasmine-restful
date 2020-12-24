import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import Erc20Service from "./erc20.service";
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AddressResponse} from "./models/address.response";
import {ResponseGenerator} from "../common/models/response.model";
import {Tags} from "../common/tags";
import BridgeResponse from "./models/bridge.response";
import BN from "bn.js";
import AddressPipe from "../tfc/address.pipe";
import BnPipe from "./pipes/bn.pipe";

@Controller("ethereum/erc20")
@ApiTags(Tags.ETHEREUM)
export default class Erc20Controller {
    constructor(
        private readonly erc20Service: Erc20Service
    ) {
    }

    @Get("address")
    @ApiOperation({summary: "Get TFC ERC20 Contract Address"})
    @ApiBadRequestResponse({description: "Invalid query parameters"})
    @ApiOkResponse({type: AddressResponse})
    public async getTFCManager(): Promise<AddressResponse> {
        return ResponseGenerator.OK({
            address: this.erc20Service.getAddress(),
        });
    }

    @Get("exchange/bridge-requirement")
    public async getBridgeInfo(
        @Query("recipient", AddressPipe) recipient: string,
        @Query("amount", BnPipe) amount: string,
    ): Promise<BridgeResponse> {
        const data = await this.erc20Service.getBridgeRequirement(recipient, new BN(amount));
        return ResponseGenerator.OK(data);
    }
};
