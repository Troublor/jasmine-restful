import {Controller, Get} from "@nestjs/common";
import {VersionResponse} from "./models/version.response";
import {getCurrentVersion} from "../common/utils";
import {ResponseGenerator} from "../common/models/response.model";
import EthFactoryService from "../factory/eth-factory.service";
import {ApiTags} from "@nestjs/swagger";
import {Tags} from "../common/tags";

@Controller("/")
@ApiTags(Tags.MISC)
export default class MiscController {
    constructor(
        private readonly ethFactoryService: EthFactoryService
    ) {
    }

    @Get("version")
    public getVersion(): VersionResponse {
        const ver = getCurrentVersion();
        const major = parseInt(ver.split(".")[0]);
        const minor = parseInt(ver.split(".")[1]);
        const patch = parseInt(ver.split(".")[2]);
        return ResponseGenerator.OK({
            versionNum: major * 1000000 + minor * 1000 + patch,
            versionStr: `v${major}.${minor}.${patch}`,
            dependencies: {
                "jasmine-eth-ts": this.ethFactoryService.sdk.version,
            },
        });
    }
};
