import {Module} from "@nestjs/common";
import EthFactoryService from "./eth-factory.service";

@Module({
    providers: [EthFactoryService],
    exports: [EthFactoryService],
})
export default class FactoryModule {
};
