import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import SDK, {Manager, TFC} from "jasmine-eth-ts";

@Injectable()
export default class EthFactoryService {
    constructor(
        private readonly configService: ConfigService
    ) {
    }

    get sdk(): SDK {
        return new SDK(this.configService.get<string>("ethereum.endpoint.internal", "ethereum endpoint unprovided"));
    }

    get tfc(): TFC {
        return this.sdk.getTFC(this.configService.get<string>("ethereum.contracts.erc20", "tfc-erc20 address unprovided"));
    }

    get manager(): Manager {
        return this.sdk.getManager(this.configService.get<string>("ethereum.contracts.manager", "tfc-manager address unprovided"));
    }
};
