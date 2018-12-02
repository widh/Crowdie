// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    var np = document.getElementById("btn-new");
    var wa = document.getElementById("btn-wallet");

    np.onclick = function () {
        Crde.new.open();
    };

    wa.onclick = function () {
        Crde.wallet.open();
    };
    
}, "crowdie");
