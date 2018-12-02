// (c) Yuoa

import express from "express";
import socket from "socket.io";
import path from "path";
import * as socset from "./socset.mjs";
import * as router from "./router.mjs";

export class WebService {

    constructor(log, e, arg, w3) {
        this.log = log;
        this.e = e;
        this.port = Number(arg.port || 2367);
        this.period = Number(arg.period || 604800);
        this.dbPath = arg.dbPath;
        this.w3 = w3;
        this.dirname = path.dirname(new URL(import.meta.url).pathname);
    }

    async start() {
        // Load modules
        const sass = (await import("node-sass-middleware")).default;

        // Load express and set basic configurations
        const app = this.app = express();
        app.set("etag", "strong");
        app.set("views", path.join(this.dirname, "views"));
        app.set("view engine", "pug");
        app.disable("x-powered-by");
        app.use(sass({
            src: path.join(this.dirname, "scss"),
            dest: path.join(this.dirname, "css"),
            outputStyle: "compressed",
            prefix: "/css"
        }));
        app.use("/css", express.static(path.join(this.dirname, "css")));
        app.use("/js", express.static(path.join(this.dirname, "js")));
        app.use("/images", express.static(path.join(this.dirname, "images")));
        app.use("/musics", express.static(path.join(this.dirname, "musics")));

        // Bind paths
        router.bind(this.log, this.e, app, this.dbPath);

        // Start web service
        const web = app.listen(this.port, () => {
            this.log.info(`Web service is successfully initialized on port ${this.port}.`);
        });

        // Bind websocket service
        const io = new socket(web);
        socset.web(this.log, this.e, this.w3, io, this.period);
    }

};

export class DBService {
    
    constructor(log, e, arg) {
        this.log = log;
        this.e = e;
        this.port = Number(arg.port || 2368);
    }

    start() {
        // Create express object
        const app = this.app = express();
        app.set("etag", "strong");
        app.disable("x-powered-by");

        // Bind simple response
        app.use((i, o) => {
            o.status(200).end("Crowide Data Service Status All GREEEEEN.");
        });
        
        // Start web service
        const web = app.listen(this.port, () => {
            this.log.info(`DB service is successfully initialized on port ${this.port}.`);
        });

        // Bind websocket service
        const io = new socket(web);
        socset.db(this.log, this.e, io);
    }

};
