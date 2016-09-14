"use strict";

var fs   = require("fs"),
    path = require("path");

module.exports = fs.readdirSync(path.join(__dirname, "/transforms")).map(
    (t) => path.join(__dirname, `./transforms/${t}/index.js`)
);
