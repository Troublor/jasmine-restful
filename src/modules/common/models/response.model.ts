import {ApiProperty} from "@nestjs/swagger";

export default abstract class Response<T = any> {
    @ApiProperty({
        type: Number,
        description: "response status code",
    })
    code!: number;

    @ApiProperty({
        type: String,
        description: "description of response status",
    })
    msg!: string;

    @ApiProperty({
        description: "response data",
    })
    abstract data: T | null;
};

export class ResponseGenerator {
    static Raw<T>(code: number, msg: string, data: T): Response<T> {
        return {
            code: code,
            msg: msg,
            data: data,
        } as Response<T>;
    }

    static OK<T>(data: T): Response<T> {
        return ResponseGenerator.Raw(200, "OK", data);
    }

    static BadRequest(message: string): Response<null> {
        return ResponseGenerator.Raw(400, message, null);
    }

    static InternalError(): Response<null> {
        return ResponseGenerator.Raw(500, "Server internal error", null);
    }
}
