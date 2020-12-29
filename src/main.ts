import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Tags} from "./modules/common/tags";
import {HttpExceptionFilter} from "./http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: ["log", "warn", "error", "debug", "verbose"],
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    const config = app.get<ConfigService>(ConfigService);

    const options = new DocumentBuilder()
        .setTitle("Jasmine Project Ethereum RESTful API")
        .setDescription("The RESTful API specification of Jasmine Project to retrieve data from Ethereum")
        .setVersion("0.1")
        .addTag(Tags.ETHEREUM)
        .addTag(Tags.ETHEREUM_ERC20)
        .addTag(Tags.ETHEREUM_ERC20_MANAGER)
        .addTag(Tags.LEGACY)
        .addTag(Tags.MISC)
        .build();
    const document = SwaggerModule.createDocument(app, options, {});
    SwaggerModule.setup("api", app, document);

    const restfulPort = config.get<string>("port", "restful port unprovided");
    await app.listen(restfulPort);
}

(async () => {
    await bootstrap();
})();
