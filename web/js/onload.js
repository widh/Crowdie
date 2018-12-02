// (c) Yuoa
window.onload = function () {
    var agent = navigator.userAgent.toLowerCase();
    if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
        // If IE, show not-supported alert
        alert("Go out, IE.");
        history.back();
    } else if (typeof window.Crdy === "object") {
        // Make object controller
        window.Crde = {};

        // Set flag
        window.onload.launched = true;

        // Launch functions
        for (let i in Crdy) {
            window.Crde[i] = {};
            Crdy[i](window.Crde[i]);
        }
    }
};
