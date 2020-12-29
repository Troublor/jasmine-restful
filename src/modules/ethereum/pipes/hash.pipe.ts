import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export default class HashPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        value = value.trim();
        if (!new RegExp(/^0x([A-Fa-f0-9]{64})$/).test(value)) {
            throw new BadRequestException(`Invalid ${metadata.type} '${metadata.data}'`, `${value} is not a valid Ethereum hash`);
        }
        return value;
    }
};
