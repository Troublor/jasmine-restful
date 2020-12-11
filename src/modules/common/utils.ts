// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as fs from "fs";
import * as path from "path";
import appRoot from "app-root-path";

export function getCurrentVersion(): string {
    const packageInfo = JSON.parse(fs.readFileSync(path.join(appRoot.path, "package.json"), {encoding: "utf-8"}));
    return packageInfo.version;
}
