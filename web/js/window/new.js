// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    var nwin = document.getElementById("new");
    var npSend = document.getElementById("np-send");
    var npName = document.getElementById("np-name");
    var npValue = document.getElementById("np-value");
    var npAddr = document.getElementById("np-address");
    var npPwd = document.getElementById("np-pwd");
    var npDesc = document.getElementById("np-desc");
    var npState = document.getElementById("np-state");
    var close = document.querySelector("#new button.close");

    npSend.onclick = function () {
        Crde.w3.npRequest({
            name: npName.value,
            value: npValue.value,
            addr: npAddr.selectedOptions[0].textContent,
            pwd: npPwd.value,
            desc: npDesc.value
        });
    };

    w.disable = function () {
        npName.disabled = true;
        npValue.disabled = true;
        npAddr.disabled = true;
        npPwd.disabled = true;
        npSend.disabled = true;
        close.disabled = true;
        npDesc.disabled = true;
    };
    
    w.enable = function () {
        npName.disabled = false;
        npValue.disabled = false;
        npAddr.disabled = false;
        npPwd.disabled = false;
        npSend.disabled = false;
        close.disabled = false;
        npDesc.disabled = false;
    };

    w.setStatus = function (msg) {
        npState.innerHTML = msg ? msg : "";
    };

    close.onclick = w.close = function () {
        Crde.window.reset(nwin);
        npName.value = "";
        npValue.value = "";
        npPwd.value = "";
        npDesc.value = "";
        w.enable();
        w.setStatus("");
    };

    w.open = function () {
        nwin.style.setProperty("display", "block");
    };

    w.addOption = function (a) {
        var ro = document.createElement("option");
        ro.innerHTML = a;

        npAddr.appendChild(ro);
    };
    
}, "new");
