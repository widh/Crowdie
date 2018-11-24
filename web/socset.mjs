// (c) Yuoa

export const bind = (log, e, w3, io) => {

    var k = {log: log, e: e, w3: w3, io: io};
    
    io.on('connection', (soc) => {

        soc.on("eval", (d) => {
            var x = eval(d);
            soc.emit("result", x);
        });

        soc.on("var", (d) => {
            soc.emit("result", k[d]);
        })

    });

};
