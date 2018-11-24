// (c) Yuoa
var Crdy = Crdy || {};
(function (fn) {
    if (window.onload.launched) fn();
    else Crdy.m = fn;
})(function () {

    var i = Math.floor(Math.random() * 2);
    var a = document.createElement("audio");
    a.src = "/musics/" + i + ".ogg";
    a.loop = true;
    document.body.appendChild(a);
    a.play();
    
});
