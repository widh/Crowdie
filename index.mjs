#!/usr/bin/env -S node --experimental-modules
import {init, log, e, pkg, arg} from "./core/init.mjs";
import serve from "./web";

init.then(() => {
    switch (arg.fn.keyword) {

        case "run":
        return serve(arg, log, e);

    }
})
.catch(e.parse(0x200, "Unknown error occurred while executing some code segments."));
