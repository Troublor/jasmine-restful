import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import EthFactoryService from "../factory/eth-factory.service";
import BN from "bn.js";
import {Address} from "jasmine-eth-ts";
import {ContractEvent, TransferEventParams} from "./models/event-list.response";

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
        const minGas = this.configService.get<number | null>("ethereum.exchange.bridgeMinGas", null);
        const estimatedGas = await txObj.estimateGas({
            from: minter.address,
        });
        let gas;
        if (!minGas) {
            gas = estimatedGas;
        } else {
            gas = minGas > estimatedGas ? minGas : estimatedGas;
        }
        const fixedGasPrice = this.configService.get<number | null>("ethereum.exchange.bridgeGasPrice", null);
        let gasPrice;
        if (fixedGasPrice) {
            gasPrice = new BN(fixedGasPrice);
        } else {
            gasPrice = new BN(await sdk.web3.eth.getGasPrice());
        }
        const rate = this.configService.get<number>("ethereum.exchange.bridgeTransactionFeeRate", 0);
        return {
            exchangeBridgeAddress: minter.address,
            requiredTransferAmount: sdk.web3.utils.fromWei(new BN(gas * (1 + rate)).mul(gasPrice).toString()),
        };
    }

    public async balanceOf(address: Address): Promise<BN> {
        const tfc = this.ethFactoryService.tfc;
        return await tfc.balanceOf(address);
    }

    public async transferEventsOf(address: Address): Promise<ContractEvent<TransferEventParams>[]> {
        const eventName = "Transfer";
        const tfc = this.ethFactoryService.tfc;
        const fromEvents = await tfc.contract.getPastEvents(eventName, {
            fromBlock: this.configService.get<number>("filter.fromBlock", 0),
            filter: {
                from: address,
            },
            toBlock: this.configService.get<number>("filter.toBlock", 0),
        });
        const toEvents = await tfc.contract.getPastEvents(eventName, {
            fromBlock: this.configService.get<number | string>("filter.fromBlock", 0),
            filter: {
                to: address,
            },
            toBlock: this.configService.get<number | string>("filter.toBlock", "latest"),
        });
        const events = [...fromEvents, ...toEvents];
        return events
            .sort((e1, e2): number => {
                if (e1.blockNumber < e2.blockNumber) return -1;
                else if (e1.blockNumber > e2.blockNumber) return 1;
                else {
                    if (e1.transactionIndex < e2.transactionIndex) return -1;
                    else if (e1.transactionIndex > e2.transactionIndex) return 1;
                    else {
                        if (e1.logIndex < e2.logIndex) return -1;
                        else if (e1.logIndex > e2.logIndex) return 1;
                        else return 0;
                    }
                }
            })
            .map(ev => {
                return {
                    name: ev.event,
                    params: {
                        from: ev.returnValues["from"],
                        to: ev.returnValues["to"],
                        value: "0x" + new BN(ev.returnValues["value"]).toString("hex"),
                    },
                    blockNumber: ev.blockNumber,
                    blockHash: ev.blockHash,
                    txHash: ev.transactionHash,
                } as ContractEvent<TransferEventParams>;
            });
    }
}
