// Yuoa
// Program constants

import os from "os";
import path from "path";

// [String]
export const APPNAME = "Vapor Crowd";
export const APPNAME_ABBR = "vcwd";

// [Path]
// NOTE: To point a file/dir in this program, USE RELATIVE PATH
export const DIR_LOG = path.join(os.homedir(), `.${APPNAME_ABBR}`);
export const FILE_LOG = "process.log";

// [Argument Parsing]
export const APP_DEFFUNC = "launchServer";
export const APP_FUNC = {
    run: {
        keyword: "run",
        abbr: "r",
        alias: ["launch", "start", "begin"],
        description: "Run the program",
        options: ["quiet"]
    }
};
export const APP_OPT = {
    quiet: {
        flags: ["--quiet", "-q"],
        type: "ARGOPT_NO_DATA",
        description: "Don't print debug messages.",
        required: false
    }
};
