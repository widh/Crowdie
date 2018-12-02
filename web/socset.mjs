// (c) Yuoa

import iter from "../util/iterate.mjs";
import * as cs from "../core/const.mjs";
import * as json from "../util/json.mjs";

export const web = (log, e, w3, io, period) => {
    
    // Get contracts
    var abi, code;
    json.parse("contracts/crowdie.json")
        .then(c => {
            var cont = c.contracts['crowdie.sol:CrowdieFunding'];
            abi = JSON.parse(cont.abi);
            code = `0x${cont.bin}`;
        });

    // Prepare websocket bindings
    var eventSoc = {};
    var watchingAcc = {};
    var isFirstWatch = true;
    const checkInterval = 2000;
    
    // Bind socket connection
    io.on('connection', (soc) => {
        log.info("Gathering accounts...", "Connecting...");

        // Initialize event emitter
        eventSoc[soc.id] = soc;

        // When disconnected
        soc.on('disconnect', () => {
            log.warn("Disconnected.");

            // Remove socket from event emitter
            delete eventSoc[soc.id];
        });

        // New contract requested
        soc.on('np request', r => {
            soc.emit("np update", "Unlocking...");
            w3.eth.personal.unlockAccount(r.addr, r.pwd)
                .catch(_ => {
                    return false;
                })
                .then(x => {
                    if (x === false) {
                        soc.emit("np result", ["Failed", "Wrong password"]);
                        log.error("Wrong password", "NP Failed");
                    } else {
                        soc.emit("np update", "Transmitting...");
                        var inWei = w3.utils.toWei(r.value);
                        var nc = new w3.eth.Contract(abi);
                        var ncTx = nc.deploy({
                            data: code,
                            arguments: [r.name, r.desc, period, inWei]
                        });
                        ncTx.estimateGas().then(_ => {
                            log.info(_, "ExpectedGas");
                            ncTx.send({
                                from: r.addr,
                                gas: _
                            }).on('transactionHash', _ => {
                                log.success("New contract created", "NP Success");
                                log.debug(_);
                                soc.emit("np update", "Confirming...");
                            }).on('receipt', rc => {
                                log.success("New contract confirmed", "NP Success");
                                soc.emit("np result", ["Success", [r.addr, rc.contractAddress]]);
                            }).catch(error => {
                                soc.emit("np result", ["Failed", "Balance Lack"]);
                                e.parse(0x600, "Unknown error occurred")(error);
                            });
                        }).catch(error => {
                            soc.emit("np result", ["Failed", "Gas Error"]);
                            e.parse(0x700, "Gas estimation failed")(error);
                        });
                    }
                });
        });

        // Get checking the project
        soc.on('p check', a => {
            soc.emit("p update", [a[0], ["Update", "Checking..."]]);
            var c = new w3.eth.Contract(abi, a[0]);
            c.methods.checkGoalReached().call({
                from: a[1]
            }).then(_ => {
                c.methods.end().call().then(es => {
                    if (end === "true") {
                        c.methods.totalAmount().call().then(ta => {
                            soc.emit("p update", [a[0], ["Success", ta]]);
                        }).catch(e => {
                            soc.emit("p update", [a[0], ["Failed", "Balance Lack"]]);
                            e.parse(0x1000, "Unknown error occured")(error);
                        });
                    } else {
                        soc.emit("p update", [a[0], ["Failed", "Unknown reason"]])
                    }
                }).catch(e => {
                    soc.emit("p update", [a[0], ["Failed", "End call failed"]]);
                    e.parse(0x1100, "Unknown error occured")(error);
                });
            }).catch(e => {
                soc.emit("p update", [a[0], ["Failed", "Result call failed"]]);
                e.parse(0x1200, "Unknown error occured")(error);
            });
        });

        // New investing requested
        soc.on('p invest', r => {
            soc.emit("iv update", "Unlocking...");
            w3.eth.personal.unlockAccount(r.addr, r.pwd)
                .catch(_ => {
                    return false;
                })
                .then(x => {
                    if (x === false) {
                        soc.emit("iv result", ["Failed", "Wrong password"]);
                        log.error("Wrong password", "IV Failed");
                    } else {
                        soc.emit("iv update", "Transmitting...");
                        var inWei = w3.utils.toWei(r.value);
                        var c = new w3.eth.Contract(abi, r.proj);
                        c.methods.fund().send({
                            from: r.addr,
                            value: inWei
                        }).on('transactionHash', _ => {
                            log.success("Investigation started", "IV Success");
                            log.debug(_);
                            soc.emit("iv update", "Confirming...");
                        }).on('receipt', rc => {
                            log.success("Investigation confirmed", "IV Success");
                            log.debug(rc, "Rc");
                            soc.emit("iv result", ["Success", rc.transactionHash]);
                        }).catch(error => {
                            soc.emit("iv result", ["Failed", "Balance Lack"]);
                            e.parse(0x800, "Unknown error occured")(error);
                        });
                    }
                });
        });

        // Contract information requested
        soc.on('p fetch', q => {
            var d = {all: q[0], info: {}};
            if (q[1].length == 0) {
                soc.emit("info projects", d);
            } else {
                iter(q[1], ca =>
                    (ok, no) => {
                        var c = new w3.eth.Contract(abi, ca);
                        var o = {};
                        c.methods.title().call().then(t => {
                            o.title = t;
                            return c.methods.desc().call();
                        }).then(de => {
                            o.desc = de;
                            return c.methods.goalAmount().call();
                        }).then(ga => {
                            o.target = w3.utils.fromWei(ga);
                            return c.methods.Investors(0).call();
                        }).then(iv => {
                            o.investors = iv;
                            return c.methods.totalAmount().call();
                        }).then(ta => {
                            o.now = w3.utils.fromWei(ta);
                            return c.methods.owner().call();
                        }).then(on => {
                            o.owner = on;
                            return c.methods.deadline().call();
                        }).then(dl => {
                            o.duration = dl;
                        }).then(_ => {
                            ok([ca, o]);
                        });
                    }
                ).then(_ => {
                    d.info = _;
                    soc.emit("info projects", d);
                });
            }
        });

    });

    // Manage account list and make event listener
    const checkAccount = () => {
        if (Object.keys(eventSoc).length) {
            log.info("Checking account changes...", "Watching");
            w3.eth.getAccounts().then(accounts =>
                iter(accounts, item =>
                    (ok, no) =>
                        w3.eth.getBalance(item).then(balance => {
                            ok([item, Number(balance / Number(w3.utils.unitMap.ether))])
                        })
                )
            ).then(balances => {
                if (balances && !isFirstWatch) {
                    log.info("Upload balance information...", "Watching");
                    for (var i in eventSoc) {
                        eventSoc[i].emit("info balance", balances);
                    }
                }
                isFirstWatch = false;
                setTimeout(checkAccount, checkInterval);
            }).catch(e.parse(0x400, "Unknown error occurred in watching"));
        } else
            setTimeout(checkAccount, checkInterval);
    };
    checkAccount();

};

export const db = (log, e, io) => {

    const sendInterval = 8000;
    
    var data = {}, inversedData = {}, connections = {};
    json.parse(cs.DB_PATH)
        .then(load => {
            data = load;
            for (var i in data) {
                for(var j in data[i])
                    inversedData[data[i][j]] = i;
            }
        }, () => {});

    var saveInvoked = false, doAgain = false;
    const updateFDB = () => {
        if (!saveInvoked) {
            saveInvoked = true;
            json.save(cs.DB_PATH, data).then(
                _ => {
                    saveInvoked = false;
                    if (doAgain) updateFDB();
                }
            );
        } else doAgain = true;
    };

    io.on("connection", (soc) => {

        connections[soc.id] = soc;

        soc.emit("info contracts", data);

        soc.on('db fetch', () => {
            soc.emit("info contracts", data);
        });

        soc.on('disconnect', () => {
            delete connections[soc.id];
        });

        soc.on('db add', (pair) => {
            log.debug(pair, "Add");
            if (pair instanceof Array && pair.length == 2) {
                if (data[pair[0]]) {
                    data[pair[0]].push(pair[1]);
                } else {
                    data[pair[0]] = [pair[1]];
                }
                updateFDB();
                inversedData[pair[1]] = pair[0];
            }
        });

        soc.on('db expire', (cont) => {
            log.info(cont, "Expire");
            var owner = inversedData[cont];
            var conti = data[owner].indexOf(cont);
            if (conti >= 0) {
                data[owner].splice(conti, 1);
            }
            updateFDB();
            delete inversedData[cont];
        });

    });

    const sendUpdate = () => {
        if (Object.keys(connections).length) {
            for (var i in connections) {
                connections[i].emit("info contracts", data);
            }
        }
    };
    setInterval(sendUpdate, sendInterval);

};
