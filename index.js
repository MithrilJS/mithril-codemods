"use strict";

var fs = require("fs");

module.exports = fs.readdirSync("./transforms").map((t) => `./transforms/${t}/index.js`);
