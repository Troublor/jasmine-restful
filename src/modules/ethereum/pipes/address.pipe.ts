import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import EthFactoryService from "../../factory/eth-factory.service";

@Injectable()
export default class AddressPipe implements PipeTransform<string, string> {
    constructor(
        private readonly ethFactoryService: EthFactoryService,
    ) {
    }

    transform(value: string): string {
        const web3 = this.ethFactoryService.sdk.web3;
        if (!web3.utils.isAddress(value)) {
            throw new BadRequestException(`${value} is not an Ethereum address`);
        }
        return value;
    }
};
