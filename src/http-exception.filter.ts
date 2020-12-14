import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from "@nestjs/common";
import {Response} from "express";
import {ResponseGenerator} from "./modules/common/models/response.model";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        switch (status) {
            case 400:
                response
                    .status(status)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    .json(ResponseGenerator.BadRequest(exception.getResponse()["error"]));
                break;
            case 500:
                response
                    .status(status)
                    .json(ResponseGenerator.InternalError());
                break;
            default:
                response
                    .status(status)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    .json(ResponseGenerator.Raw(status, exception.getResponse()["error"], null));
        }

    }
}
