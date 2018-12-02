// Yuoa
// Program constants

import os from "os";
import path from "path";

// [String]
export const APPNAME = "Crowdie";
export const APPNAME_ABBR = "crdy";

// [Path]
// NOTE: To point a file/dir in this program, USE RELATIVE PATH
export const LOG_DIR = path.join(os.homedir(), `.${APPNAME_ABBR}`, "log");
export const LOG_DEFAULT_FILE = "process.log";
export const DB_PATH = path.join(os.homedir(), `.${APPNAME_ABBR}`, "db.json");

// [Argument Parsing]
export const APP_DEFFUNC = "web";
export const APP_FUNC = {
    run: {
        keyword: "web",
        description: "Run the web front-end",
        options: ["port", "ipc", "period", "dbPath"],
        log: "web.log"
    },
    db: {
        keyword: "db",
        description: "Run the databse server",
        options: ["port"],
        log: "db.log"
    }
};
export const APP_OPT = {
    port: {
        flags: ["--port", "-p"],
        type: "ARGOPT_WITH_DATA",
        description: "Start the web server to given port (Default: 2367(web), 2368(db))."
    },
    ipc: {
        flags: ["--ipc", "-i"],
        type: "ARGOPT_WITH_DATA",
        description: "Connect to geth with given ipc.",
        required: true
    },
    period: {
        flags: ["--period"],
        type: "ARGOPT_WITH_DATA",
        description: "Specifies default crowdfunding period in seconds (Default: 7 days)."
    },
    dbPath: {
        flags: ["--db-path", "-d"],
        type: "ARGOPT_WITH_DATA",
        description: "Specifies Crowdie DB path.",
        required: true
    }
};
