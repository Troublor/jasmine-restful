import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import BN from "bn.js";

@Injectable()
export default class BnPipe implements PipeTransform<string, BN> {
    transform(value: string, metadata: ArgumentMetadata): BN {
        try {
            return new BN(value);
        } catch (e) {
            throw new BadRequestException(`Invalid ${metadata.type} '${metadata.data}'`, `${value} is not a BN compatible number`);
        }
    }
};
