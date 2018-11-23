#!/usr/bin/env -S node --experimental-modules
import {init, log, e, pkg, arg} from "./core/init.mjs";

init.then(() => {

    log.success("Initialized Yuoa base-mjs!");
    log.debug(pkg);
    log.debug(arg);

})
.catch(e.parse(0x200, "Unknown error occurred while executing some code segments."));
