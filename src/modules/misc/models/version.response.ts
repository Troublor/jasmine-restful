import Response from "../../common/models/response.model";
import {ApiProperty} from "@nestjs/swagger";

export class VersionResponse extends Response {
    @ApiProperty({
        type: "object",
        properties: {
            versionStr: {type: "string"},
            versionNum: {type: "number"},
            dependencies: {
                type: "object", properties: {
                    "jasmine-eth-ts": {
                        type: "object",
                        properties: {
                            versionStr: {type: "string"},
                            versionNum: {type: "number"},
                        },
                    },
                },
            },
        },
    })
    data!: {
        versionStr: string,
        versionNum: number,
        dependencies: {
            "jasmine-eth-ts": {
                versionStr: string,
                versionNum: number,
            }
        }
    } | null;

}
