"use strict";

var fs = require("fs");

fs.readdirSync("./transforms").forEach((t) => {
    exports[t] = require(`./transforms/${t}`);
});

