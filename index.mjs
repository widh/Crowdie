#!/usr/bin/env -S node --experimental-modules
import {init, log, e, pkg, arg} from "./core/init.mjs";
import {serve, data} from "./web";

init.then(() => {
    switch (arg.fn.keyword) {

        case "web":
        return serve(arg, log, e);

        case "db":
        return data(arg, log, e);

    }
})
.catch(e.parse(0x200, "Unknown error occurred while executing some code segments."));
