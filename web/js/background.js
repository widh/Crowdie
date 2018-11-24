// (c) Yuoa
var Crdy = Crdy || {};
(function (fn) {
    if (window.onload.launched) fn();
    else Crdy.bg = fn;
})(function () {

    var i = Math.floor(Math.random() * 10);
    document.getElementById("crowdie").style.setProperty("background-image", "url('/images/background/" + i + ".gif')");
    
});
