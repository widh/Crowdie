// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    var myFirst = true, allFirst = true;

    var s = io();

    s.on("info balance", function (al) {
        for (var i in al) {
            var found = document.getElementById("ac-" + i);

            if (found == null) {
                Crde.wallet.add(i, al[i]);
                Crde.new.addOption(i);
                Crde.invest.addOption(i);
            } else
                found.children[2].textContent = al[i];
        }
    });

    s.on("np result", function (s) {
        if (s[0] === "Success") {
            Crde.new.close();
            Crde.alert.open("/images/icon/success.ico", "Project uploaded!<br>" + s[1][1]);
            Crde.db.add(s[1]);
            Crde.db.fetch();
        } else {
            Crde.new.enable();
            Crde.new.setStatus(s[1]);
        }
    });

    s.on("np update", function (s) {
        Crde.new.setStatus(s);
    });

    s.on("p update", function (s) {
        var bGet = document.getElementById("ctbt_" + s[0] + "false");
        if (bGet !== null) {
            if (s[1][0] === "Update") {
                bGet.innerHTML = s[1][1];
            } else if (s[1][0] === "Failed") {
                Crde.alert.open("/images/icon/error.ico", "Failed to receive your rewards" );
                bGet.innerHTML = "Get Ether";
                bGet.disabled = false;
            } else {
                bGet.disabled = true;
                bGet.innerHTML = "Rewarded";
                Crde.alert.open("/images/icon/success.ico", "Success!<br>" + s[1][1] + " eth");
            }
        }
    });

    s.on("iv result", function (s) {
        if (s[0] === "Success") {
            Crde.invest.close();
            Crde.alert.open("/images/icon/success.ico", "Successfully invested!<br>Tx ID: <i>" + s[1] + "</i>");
            Crde.db.fetch();
        } else {
            Crde.invest.enable();
            Crde.invest.setStatus(s[1]);
        }
    });

    s.on("iv update", function (s) {
        Crde.invest.setStatus(s);
    });

    s.on("info projects", d => {
        console.log(d);
        var tg = document.getElementById(d.all ? "crow-all" : "crow-my").children[0];
        var addList = [];

        // Initialize inner html
        if (d.all && allFirst) {
            allFirst = false;
            tg.innerHTML = "";
        } else if (!d.all && myFirst) {
            myFirst = false;
            tg.innerHTML = "";
        }
        
        for (var i in d.info) {
            // Add items
            if (document.getElementById("ct_" + i + d.all) == null) {
                // Check is expired
                if (d.all && Number(d.info[i].duration) < Number(moment().format('X')))
                    continue;

                var li = document.createElement("li");
                li.id = "ct_" + i + d.all;

                var a = document.createElement("a");
                a.href = "#";
                a.classList.add("uk-accordion-title");
                a.textContent = d.info[i].title;

                var div = document.createElement("div");
                div.classList.add("uk-accordion-content");

                var pDesc = document.createElement("p");
                pDesc.classList.add("pl-desc");
                pDesc.textContent = d.info[i].desc;

                var pInfo = document.createElement("p");
                pInfo.classList.add("pl-info");

                var bPercent = document.createElement("b");
                bPercent.id = "ctbp_" + i + d.all;
                bPercent.innerHTML = "[" + Math.floor(d.info[i].now / d.info[i].target * 100) + "%]";

                var bTarget = document.createElement("b");
                bTarget.textContent = "Target (ETH):";
                    
                var sTarget = document.createElement("span");
                sTarget.textContent = d.info[i].target;
                    
                var bNow = document.createElement("b");
                bNow.textContent = "Now (ETH):";
                    
                var sNow = document.createElement("span");
                sNow.id = "ctsn_" + i + d.all;
                sNow.textContent = d.info[i].now;
                    
                var bDur = document.createElement("b");
                bDur.textContent = "Until:";
                    
                var sDur = document.createElement("span");
                sDur.textContent = moment.unix(d.info[i].duration).format("MMMM Do YYYY, h:mm:ss A");
                    
                pInfo.appendChild(bPercent);
                pInfo.appendChild(bTarget);
                pInfo.appendChild(sTarget);
                pInfo.appendChild(bNow);
                pInfo.appendChild(sNow);
                pInfo.appendChild(bDur);
                pInfo.appendChild(sDur);

                var pOwner = document.createElement("p");
                pOwner.classList.add("pl-last");
                pOwner.textContent = d.info[i].owner;

                div.appendChild(pDesc);
                div.appendChild(pInfo);
                    
                if (d.all) {
                    pOwner.classList.add("pl-owner");

                    var bInvest = document.createElement("button");
                    bInvest.classList.add("pl-last");
                    bInvest.innerHTML = "Invest";
                    bInvest.id = "ctbt_" + i + d.all;
                    bInvest.dataset.addr = i;
                    bInvest.onclick = function (e) {
                        document.getElementById("iv-proj").value = e.target.dataset.addr;
                        invest.style.setProperty("display", "block");
                    };
                    bInvest.disabled = Crde.invest.isDisabled;

                    div.appendChild(pOwner);
                    div.appendChild(bInvest);
                } else {
                    var bGet = document.createElement("button");
                    bGet.classList.add("pl-last");
                    
                    if (Number(d.info[i].duration) < Number(moment().format('X'))) {
                        // If expired
                        if (d.info[i].end === "true") {
                            bGet.innerHTML = "Rewarded";
                            bGet.disabled = true;
                        } else {
                            bGet.innerHTML = "Get Ether";
                            bGet.onclick = function (e) {
                                s.emit("p check", [e.target.dataset.addr, e.target.dataset.from]);
                                e.target.innerHTML = "Checking...";
                                e.target.disabled = true;
                            };
                        }
                    } else {
                        // If not expired
                        bGet.innerHTML = "Not Ended";
                        bGet.disabled = true;
                    }
                    bGet.id = "ctbt_" + i + d.all;
                    bGet.dataset.addr = i;
                    bGet.dataset.from = d.info[i].owner;

                    pOwner.classList.add("pl-manager");
                    div.appendChild(pOwner);
                }

                li.appendChild(a);
                li.appendChild(div);

                addList.push(li);
            } else {
                // Check is expired
                if (Number(d.info[i].duration) < Number(moment().format('X'))) {
                    if (d.all) {
                        var bInvest = document.getElementById("ctbt_" + i + d.all);
                        bInvest.disabled = true;
                        bInvest.innerHTML = "Expired";
                        bInvest.classList.add("expired");
                    } else {
                        var bGet = document.getElementById("ctbt_" + i + d.all);
                        if (d.info[i].end === "true") {
                            bGet.innerHTML = "Rewarded";
                            bGet.disabled = true;
                        } else {
                            bGet.innerHTML = "Get Ether";
                            bGet.onclick = function (e) {
                                s.emit("p check", [e.target.dataset.addr, e.target.dataset.from]);
                                e.target.innerHTML = "Checking...";
                                e.target.disabled = true;
                            };
                        }
                    }
                }

                document.getElementById("ctbp_" + i + d.all).innerHTML = "[" + Math.floor(d.info[i].now / d.info[i].target * 100) + "%]";
                document.getElementById("ctsn_" + i + d.all).textContent = d.info[i].now;
            }
        }

        if (addList.length + document.querySelectorAll("#crow-" + (d.all ? "all" : "my") + " li").length == 0) {
            if (d.all) {
                allFirst = true;
            } else {
                myFirst = true;
            }
            var pldr = document.createElement("div");
            pldr.classList.add("uk-text-center");
            pldr.classList.add("uk-placeholder");
            pldr.textContent = "Currently " + (d.all ? "there's no" : "you don't have") + " any funding projects!";
            tg.innerHTML = pldr.outerHTML;
        } else {
            for (var i in addList)
                tg.appendChild(addList[i]);
        }
    });

    w.npRequest = function (data) {
        s.emit("np request", data);
        Crde.new.disable();
        Crde.new.setStatus("Wait...");
    };

    w.ivRequest = function (data) {
        s.emit("p invest", data);
        Crde.invest.disable();
        Crde.invest.setStatus("Wait...");
    };

    w.pFetch = function (data) {
        s.emit("p fetch", data);
    };

}, "w3");
