// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    // Background
    var i = Math.floor(Math.random() * 10);
    document.querySelector("main.crowdie").style.setProperty("background-image", "url('/images/background/" + i + ".gif')");

    // Music
    var i = Math.floor(Math.random() * 2);
    var a = document.createElement("audio");
    a.src = "/musics/" + i + ".ogg";
    a.loop = true;
    document.body.appendChild(a).play();
    
}, "media");
