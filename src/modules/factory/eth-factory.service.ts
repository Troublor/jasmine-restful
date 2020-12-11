import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import SDK, {Manager, TFC} from "jasmine-eth-ts";

@Injectable()
export default class EthFactoryService {
    public readonly sdk: SDK;
    public readonly tfc: TFC;
    public readonly manager: Manager;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.sdk = new SDK(configService.get<string>("ethereum.endpoint.internal", "ethereum endpoint unprovided"));
        this.tfc = this.sdk.getTFC(configService.get<string>("ethereum.contracts.erc20", "tfc-erc20 address unprovided"));
        this.manager = this.sdk.getManager(configService.get<string>("ethereum.contracts.manager", "tfc-manager address unprovided"));
    }

};
