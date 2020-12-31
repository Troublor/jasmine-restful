import {BadRequestException, Controller, Get, Param, Query} from "@nestjs/common";
import Erc20Service from "./erc20.service";
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AddressResponse} from "./models/address.response";
import {ResponseGenerator} from "../common/models/response.model";
import {Tags} from "../common/tags";
import BridgeResponse from "./models/bridge.response";
import BN from "bn.js";
import AddressPipe from "./pipes/address.pipe";
import BnPipe from "../common/pipes/bn.pipe";
import {Address} from "jasmine-eth-ts";
import {BalanceResponse} from "./models/balance.response";
import EventListResponse, {TransferEventParams} from "./models/event-list.response";
import PositiveIntPipe from "../common/pipes/positive-int.pipe";
import {SortOrder} from "../common/enums/sort-order";
import GenEnumPipe from "../common/pipes/enum.pipe";

enum EventName {
    // all = "all",
    Transfer = "Transfer",
    // Approve = "Approve",
}

@Controller("ethereum/erc20")
@ApiTags(Tags.ETHEREUM_ERC20)
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

    @Get("balance/of/:address")
    @ApiOperation({summary: "Get TFC balance of an Ethereum address"})
    @ApiBadRequestResponse({description: "Invalid address"})
    @ApiOkResponse({type: BalanceResponse})
    public async getBalanceOf(
        @Param("address", AddressPipe) address: Address
    ): Promise<BalanceResponse> {
        const balance = await this.erc20Service.balanceOf(address);
        const resp = {
            balance: "0x" + balance.toString("hex"),
        };
        return ResponseGenerator.OK(resp);
    }

    @Get("exchange/bridge-requirement")
    public async getBridgeInfo(
        @Query("recipient", AddressPipe) recipient: string,
        @Query("amount", BnPipe) amount: string,
    ): Promise<BridgeResponse> {
        const data = await this.erc20Service.getBridgeRequirement(recipient, new BN(amount));
        return ResponseGenerator.OK(data);
    }

    @Get("events/:eventName/of/:address")
    @ApiOperation({summary: "Get events related to an Ethereum address"})
    @ApiParam({name: "eventName", enum: EventName, description: "event name"})
    @ApiParam({name: "address", description: "address of the account"})
    @ApiQuery({name: "sortOrder", enum: SortOrder, description: "sort order"})
    @ApiQuery({name: "page", type: Number, description: "page index"})
    @ApiQuery({name: "numItems", type: Number, description: "number of items in each page"})
    @ApiBadRequestResponse({description: "Invalid parameters"})
    @ApiOkResponse({type: EventListResponse})
    public async getEventsOf(
        @Param("eventName", GenEnumPipe(EventName)) eventName: EventName,
        @Param("address", AddressPipe) address: Address,
        @Query("sortOrder", GenEnumPipe(SortOrder)) sortOrder: SortOrder,
        @Query("page", PositiveIntPipe) page: number,
        @Query("numItems", PositiveIntPipe) numItems: number,
    ): Promise<EventListResponse<TransferEventParams>> {
        let events;
        switch (eventName) {
            case EventName.Transfer:
                events = await this.erc20Service.transferEvents(address);
                break;
            default:
                throw new BadRequestException();
        }
        if (sortOrder === SortOrder.DESCENDING) {
            events = events.reverse();
        }
        const numPages = Math.ceil(events.length / numItems);
        const paginatedEvents = events.slice(numItems * (page - 1), numItems * page);
        return ResponseGenerator.OK({
            metadata: {
                totalItems: events.length,
                pageItems: numItems,
                page: page,
                numPages: numPages,
            },
            events: paginatedEvents,
        });
    }

    @Get("events/:eventName/")
    @ApiOperation({summary: "Get all events"})
    @ApiParam({name: "eventName", enum: EventName, description: "event name"})
    @ApiQuery({name: "sortOrder", enum: SortOrder, description: "sort order"})
    @ApiQuery({name: "page", type: Number, description: "page index"})
    @ApiQuery({name: "numItems", type: Number, description: "number of items in each page"})
    @ApiBadRequestResponse({description: "Invalid parameters"})
    @ApiOkResponse({type: EventListResponse})
    public async getEvents(
        @Param("eventName", GenEnumPipe(EventName)) eventName: EventName,
        @Query("sortOrder", GenEnumPipe(SortOrder)) sortOrder: SortOrder,
        @Query("page", PositiveIntPipe) page: number,
        @Query("numItems", PositiveIntPipe) numItems: number,
    ): Promise<EventListResponse<TransferEventParams>> {
        let events;
        switch (eventName) {
            case EventName.Transfer:
                events = await this.erc20Service.transferEvents();
                break;
            default:
                throw new BadRequestException();
        }
        if (sortOrder === SortOrder.DESCENDING) {
            events = events.reverse();
        }
        const numPages = Math.ceil(events.length / numItems);
        const paginatedEvents = events.slice(numItems * (page - 1), numItems * page);
        return ResponseGenerator.OK({
            metadata: {
                totalItems: events.length,
                pageItems: numItems,
                page: page,
                numPages: numPages,
            },
            events: paginatedEvents,
        });
    }
};
