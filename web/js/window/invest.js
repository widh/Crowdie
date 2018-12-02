// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    var iwin = document.getElementById("invest");
    var ivSend = document.getElementById("iv-send");
    var ivValue = document.getElementById("iv-value");
    var ivPwd = document.getElementById("iv-pwd");
    var ivAddr = document.getElementById("iv-address");
    var ivProj = document.getElementById("iv-proj");
    var ivStatus = document.getElementById("iv-state");
    var close = document.querySelector("#invest button.close");

    ivSend.onclick = function () {
        Crde.w3.ivRequest({
            addr: ivAddr.selectedOptions[0].textContent,
            pwd: ivPwd.value,
            value: ivValue.value,
            proj: ivProj.value
        });
    };

    close.onclick = w.close = function () {
        Crde.window.reset(iwin);
        ivValue.value = "";
        ivPwd.value = "";
        w.enable();
        w.setStatus("");
    };

    w.open = function () {
        iwin.style.setProperty("display", "block");
    };

    w.addOption = function (a) {
        var ro = document.createElement("option");
        ro.innerHTML = a;

        ivAddr.appendChild(ro);
    }

    w.enable = function () {
        ivAddr.disabled = false;
        ivPwd.disabled = false;
        ivValue.disabled = false;
        ivSend.disabled = false;
        close.disabled = false;
        w.isDisabled = false;
        var ivBtns = document.querySelectorAll("#crow-all button:not(.expired)");
        for (var k in ivBtns) {
            ivBtns[k].disabled = false;
        }
    }

    w.disable = function () {
        ivAddr.disabled = true;
        ivPwd.disabled = true;
        ivValue.disabled = true;
        ivSend.disabled = true;
        close.disabled = true;
        w.isDisabled = true;
        var ivBtns = document.querySelectorAll("#crow-all button:not(.expired)");
        for (var k in ivBtns) {
            ivBtns[k].disabled = true;
        }
    }

    w.setStatus = function (msg) {
        ivStatus.innerHTML = msg ? msg : "";
    };

    w.isDisabled = false;
    
}, "invest");
