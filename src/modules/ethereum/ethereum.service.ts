import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import BN from "bn.js";
import {Address} from "jasmine-eth-ts";
import EthFactoryService from "../factory/eth-factory.service";

@Injectable()
export default class EthereumService {
    constructor(
        private readonly configService: ConfigService,
        private readonly ethFactoryService: EthFactoryService,
    ) {
    }

    public getEndpoint(): { ws: string, http: string } {
        return {
            ws: this.configService.get<string>(
                "ethereum.endpoint.ws",
                "endpoint not provided"
            ),
            http: this.configService.get<string>(
                "ethereum.endpoint.http",
                "endpoint not provided"
            ),
        };
    }

    public async transfer(to: Address, amount: BN, privateKey: string): Promise<string> {
        const sdk = this.ethFactoryService.sdk;
        const sender = sdk.retrieveAccount(privateKey);
        const tx = {
            to: to,
            value: amount,
            from: sender.address,
        };
        sdk.confirmationRequirement = 0;
        const receipt = await sdk.sendTransaction(tx, to, {from: sender.web3Account});
        return receipt.transactionHash;
    }
};
