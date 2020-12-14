import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import BN from "bn.js";

@Injectable()
export default class BnPipe implements PipeTransform<string, BN> {
    transform(value: string): BN {
        try {
            return new BN(value);
        } catch (e) {
            throw new BadRequestException(`${value} is not a number`);
        }
    }
};
