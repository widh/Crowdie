// (c) Yuoa

export const bind = (log, e, app, dbPath) => {
    // Main page
    app.get("/", (i, o) => {
        o.render("main", {dbPath: dbPath});
    });

    // Error Fallback
    app.use((i, o) => {
        o.render("error");
    });
};
