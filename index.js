"use strict";

var fs = require("fs");

module.exports = fs.readdirSync("./transforms").map((t) => require(`./transforms/${t}`));
