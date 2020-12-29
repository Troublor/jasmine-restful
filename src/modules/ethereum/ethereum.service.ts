import {Injectable, NotFoundException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import BN from "bn.js";
import {Address} from "jasmine-eth-ts";
import EthFactoryService from "../factory/eth-factory.service";
import {Transaction} from "./models/transaction.response";

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

    public async getTransaction(txHash: string): Promise<Transaction> {
        const sdk = this.ethFactoryService.sdk;
        const tx = await sdk.web3.eth.getTransaction(txHash);
        if (tx === null) {
            throw new NotFoundException("Not found", `transaction with hash '${txHash}' not found on blockchain`);
        }
        const receipt = await sdk.web3.eth.getTransactionReceipt(txHash);
        return {
            hash: txHash,
            blockHash: tx.blockHash,
            blockHeight: tx.blockNumber,
            nonce: tx.nonce,
            transactionIndex: tx.transactionIndex,
            from: tx.from,
            to: receipt ? receipt.to : tx.to,
            value: "0x" + new BN(tx.value).toString("hex"),
            gasUsed: receipt ? receipt.gasUsed : null,
            gasPrice: tx.gasPrice,
            input: tx.input,
            status: receipt ? receipt.status : null,
        };
    }

    public async balanceOf(address: Address): Promise<BN> {
        const sdk = this.ethFactoryService.sdk;
        return await sdk.balanceOf(address);
    }
};
