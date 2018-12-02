// (c) Yuoa

import {WebService, DBService} from "./service.mjs";

export const serve = async (arg, log, e) => {
    const Web3 = (await import("web3")).default;
    const net = (await import("net")).default;

    // Notice the ipc path
    log.info(`Geth IPC path: ${arg.ipc}`);

    return (new WebService(log, e, arg, new Web3(arg.ipc, net))).start();
};

export const data = (arg, log, e) => {
    return (new DBService(log, e, arg)).start();
};
