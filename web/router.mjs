// (c) Yuoa

export const bind = (log, e, app) => {
    // Main page
    app.get("/", (i, o) => {
        o.render("main");
    });

    // Error Fallback
    app.use((i, o) => {
        o.render("error");
    });
};
