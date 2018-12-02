// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    var awin = document.getElementById("alert");
    var icon = document.getElementById("alert-img");
    var message = document.getElementById("alert-msg");
    var close = document.querySelector("#alert button.close");

    close.onclick = function () {
        Crde.window.reset(awin);
    };

    w.open = function (img, msg) {
        icon.src = img;
        message.innerHTML = msg;
        awin.style.setProperty("display", "block");
    };
    
}, "alert");
