// (c) Yuoa
window.onload = function () {
    // If IE, show not-supported alert
    var agent = navigator.userAgent.toLowerCase();
    if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1))
        alert("Outdated browser.");

    else if (typeof window.Crdy === "object") {
        // Set flag
        window.onload.launched = true;

        // Launch functions
        for (let i in Crdy)
            Crdy[i]();
    }
};
