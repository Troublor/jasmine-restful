import { Injectable, NestMiddleware, Logger } from "@nestjs/common";

import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger("HTTP");

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl} = request;

        response.on("close", () => {
            const { statusCode } = response;
            const body = request.body;

            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${JSON.stringify(body)} - ${ip}`
            );
        });

        next();
    }
}
