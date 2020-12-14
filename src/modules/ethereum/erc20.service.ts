import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import EthFactoryService from "../factory/eth-factory.service";
import BN from "bn.js";

@Injectable()
export default class Erc20Service {
    constructor(
        private readonly configService: ConfigService,
        private readonly ethFactoryService: EthFactoryService,
    ) {
    }

    public getAddress(): string {
        return this.configService.get<string>(
            "ethereum.contracts.erc20",
            "no erc20 address provided"
        );
    }

    public async getBridgeRequirement(recipient: string, amount: BN): Promise<{ exchangeBridgeAddress: string, requiredTransferAmount: string }> {
        const sdk = this.ethFactoryService.sdk;
        const tfc = this.ethFactoryService.tfc;
        const minter = sdk.retrieveAccount(this.configService.get<string>("ethereum.exchange.bridgeAccountPrivateKey", "bridge address not provided"));
        const txObj = tfc.contract.methods.mint(recipient, amount.toString());
        const gas = new BN(await txObj.estimateGas({
            from: minter.address,
        }));
        const gasPrice = new BN(await sdk.web3.eth.getGasPrice());
        return {
            exchangeBridgeAddress: minter.address,
            requiredTransferAmount: sdk.web3.utils.fromWei(gas.mul(gasPrice).toString()),
        };
    }
}
