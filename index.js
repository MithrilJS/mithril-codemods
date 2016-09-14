"use strict";

var fs   = require("fs"),
    path = require("path"),
    
    dirs = fs.readdirSync(path.join(__dirname, "/transforms"));

exports.transforms = dirs.map((t) => path.join(__dirname, `./transforms/${t}/index.js`));
exports.names = dirs;
