import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

export default function GenEnumPipe<E extends Record<string, any>>(e: E): PipeTransform<string, E> {
    @Injectable()
    class EnumPipe implements PipeTransform<string, E> {
        transform(value: string, metadata: ArgumentMetadata): E {
            for (const key in e) {
                if (!e.hasOwnProperty(key)) {
                    continue;
                }
                if (e[key] === value) {
                    return e[key];
                }
            }
            const values = Object.values(e);
            throw new BadRequestException(`Invalid ${metadata.type} '${metadata.data}'`, `'${value}' is not one of ${JSON.stringify(values)}`);
        }
    }

    return new EnumPipe();
}
