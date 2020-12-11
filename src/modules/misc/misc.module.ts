import {Module} from "@nestjs/common";
import FactoryModule from "../factory/factory.module";
import MiscController from "./misc.controller";
import EthFactoryService from "../factory/eth-factory.service";

@Module({
    imports: [FactoryModule],
    controllers: [MiscController],
    providers: [EthFactoryService],
})
export default class MiscModule {
};
