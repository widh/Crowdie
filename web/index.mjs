// (c) Yuoa

import Service from "./service.mjs";

export default async (arg, log, e) => {
    const Web3 = (await import("web3")).default;
    const net = (await import("net")).default;

    // Notice the ipc path
    log.info(`Geth IPC path: ${arg.ipc}`);

    return (new Service(log, e, arg.port || 2367, new Web3(arg.ipc, net))).start();
};
