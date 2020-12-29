import {ArgumentMetadata, BadRequestException, Injectable, ParseIntPipe} from "@nestjs/common";

@Injectable()
export default class PositiveIntPipe extends ParseIntPipe {
    async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
        const num = await super.transform(value, metadata);
        if (!Number.isInteger(num) || num <= 0) {
            throw new BadRequestException(`Invalid ${metadata.type} '${metadata.data}'`, `${value} must be a positive integer`);
        }
        return num;
    }
};
