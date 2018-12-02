// (c) Yuoa
var Crdy = Crdy || {};
(function (fn, wn) {
    if (window.onload.launched) { window.Crde[wn] = {}; fn(window.Crde[wn]); }
    else Crdy[wn] = fn;
})(function (w) {

    // Set drag listener
    function dragMoveListener (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
        target.dataset.x = x;
        target.dataset.y = y;
    };

    // Set draggable to windows
    interact('.window:not(.resizable)')
    .draggable({
        restrict: {
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        inertia: false,
        onmove: dragMoveListener
    });

    // Set resizable to windows
    interact('.window.resizable')
    .draggable({
        restrict: {
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        inertia: false,
        onmove: dragMoveListener
    }).resizable({
        edges: { left: false, right: true, bottom: true, top: false },
        restrictEdges: {
            outer: 'parent',
            endOnly: true
        },
        restrictSize: {
            min: { width: 460, height: 179 }
        },
        inertia: false
    }).on('resizemove', function (event) {
        var target = event.target;
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
    });

    // Set initial transform point
    var windows = document.querySelectorAll(".window");
    for (let e of windows) {
        e.style.setProperty(
            "transform",
            "translate(" + e.offsetWidth / 2 + "px, " + e.offsetHeight / 2 + "px)"
            );
        e.dataset.x = e.offsetWidth / 2;
        e.dataset.y = e.offsetHeight / 2;
    }

    // Common window functions
    w.reset = function (w) {
        w.style = "display: none; transform: translate(0px, 0px);";
        w.dataset.x = 0;
        w.dataset.y = 0;
    };

}, "window");
