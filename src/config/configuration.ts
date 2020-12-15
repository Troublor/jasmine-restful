import {readFileSync} from "fs";
import * as yaml from "js-yaml";
import {join} from "path";
import Joi from "@hapi/joi";
import SDK from "jasmine-eth-ts";
import appRoot from "app-root-path";

const YAML_CONFIG_FILENAME = join(appRoot.path, "config.yml");

export default async () => {
    let config = yaml.load(
        readFileSync(YAML_CONFIG_FILENAME, "utf8"),
    );
    const ethereumNetworkSchema = Joi.object({
        endpoint: Joi.object({
            internal: Joi.string().pattern(/^(http|ws)s?:\/\/(.*)$/).required(),
            http: Joi.string().pattern(/^(http)s?:\/\/(.*)$/).required(),
            ws: Joi.string().pattern(/^(ws)s?:\/\/(.*)$/).required(),
        }),
        contracts: Joi.object().keys({
            "erc20": Joi.string().required(),
            "manager": Joi.string().required(),
        }).required(),
        exchange: Joi.object({
            bridgeAccountPrivateKey: Joi.string().required(),
            bridgeTransactionFeeRate: Joi.number().min(0).required(),
            bridgeGasPrice: Joi.number().min(60000000000),
            bridgeMinGas: Joi.number().min(60000),
        }).required(),
    });
    const schema = Joi.object({
        ethereum: ethereumNetworkSchema,
        port: Joi.number()
            .port()
            .default(8989),
        filter: Joi.object().keys({
            fromBlock: Joi.number()
                .integer()
                .min(0)
                .default(0),
        }),
    });
    const result = schema.validate(config, {
        allowUnknown: false,
    });
    if (result.error) {
        throw new Error("Config validation failed: " + result.error.message);
    }
    if (result.warning) {
        throw new Error("Config validation failed: " + result.warning.message);
    }

    config = result.value;

    // check contract deployment
    const contractDeployed = async (sdk: SDK, contracts: { erc20: string, manager: string }): Promise<boolean> => {
        const managerAddress = contracts.manager;
        const tfcAddress = contracts.erc20;
        if (managerAddress && tfcAddress) {
            const manager = sdk.getManager(managerAddress);
            const tfc = sdk.getTFC(tfcAddress);
            if (await manager.deployed() &&
                await manager.tfcAddress() === tfcAddress &&
                await tfc.deployed()
            ) {
                return true;
            }
            console.warn("Provided contract not exist on chain");
        }
        return false;
    };

    // connect to existing blockchain, check deployment
    const endpoint = config.ethereum.endpoint.internal;
    const sdk = new SDK(endpoint);
    if (!await contractDeployed(sdk, config.ethereum.contracts)) {
        throw new Error("Contract not deployed on blockchain");
    }

    return config;
};
