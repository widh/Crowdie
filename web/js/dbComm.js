// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    var s = io(dbPath);

    s.on("info contracts", (data) => {
        if (Crde.wallet.accounts && Crde.wallet.accounts.length === 0) {
            Crde.w3.pFetch([false, []]);
        } else {
            for (var i of Crde.wallet.accounts) {
                if (data[i])
                    Crde.w3.pFetch([false, data[i]]);
            }
        }
        var rq = [];
        for (var i in data) {
            rq = rq.concat(data[i]);
        }
        Crde.w3.pFetch([true, rq]);
    });

    w.add = function (data) {
        s.emit("db add", data);
    };

    w.fetch = function (data) {
        s.emit("db fetch");
    };
    
}, "db");
