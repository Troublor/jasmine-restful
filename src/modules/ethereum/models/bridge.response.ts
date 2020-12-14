import Response from "../../common/models/response.model";

export default class BridgeResponse extends Response {
    data!: {
        exchangeBridgeAddress: string,
        requiredTransferAmount: string,
    };
};
