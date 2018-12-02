// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    var wwin = document.getElementById("wallet");
    var table = document.getElementById("w-balances");
    var close = document.querySelector("#wallet button.close");

    close.onclick = function () {
        Crde.window.reset(wwin);
    };

    w.open = function () {
        wwin.style.setProperty("display", "block");
    };

    w.add = function (a, b) {
        w.accounts.push(a);

        var tdN = document.createElement("td");
        tdN.textContent = w.accounts.length;

        var tdA = document.createElement("td");
        tdA.textContent = a;

        var tdB = document.createElement("td");
        tdB.textContent = b;

        var tr = document.createElement("tr");
        tr.id = "ac-" + a;
        tr.appendChild(tdN);
        tr.appendChild(tdA);
        tr.appendChild(tdB);

        table.appendChild(tr);
    };

    w.accounts = [];
    
}, "wallet");
