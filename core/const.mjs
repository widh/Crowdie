// Yuoa
// Program constants

import os from "os";
import path from "path";

// [String]
export const APPNAME = "Crowdie";
export const APPNAME_ABBR = "crdy";

// [Path]
// NOTE: To point a file/dir in this program, USE RELATIVE PATH
export const DIR_LOG = path.join(os.homedir(), `.${APPNAME_ABBR}`);
export const FILE_LOG = "process.log";

// [Argument Parsing]
export const APP_DEFFUNC = "run";
export const APP_FUNC = {
    run: {
        keyword: "run",
        description: "Run the program",
        options: ["port", "ipc"]
    }
};
export const APP_OPT = {
    port: {
        flags: ["--port", "-p"],
        type: "ARGOPT_WITH_DATA",
        description: "Start the web server to given port."
    },
    ipc: {
        flags: ["--ipc", "-i"],
        type: "ARGOPT_WITH_DATA",
        description: "Connect to geth with given ipc.",
        required: true
    }
};
