import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import configuration from "./config/configuration";
import InfoQueryModule from "./modules/info-query/info-query.module";
import EthereumModule from "./modules/ethereum/ethereum.module";
import MiscModule from "./modules/misc/misc.module";
import {LoggerMiddleware} from "./logger.middleware";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        InfoQueryModule,
        EthereumModule,
        MiscModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes("*");
    }
}
