"use strict";

var fs   = require("fs"),
    path = require("path"),
    
    dirs = fs.readdirSync(path.join(__dirname, "/transforms")),
    
    safe   = [],
    unsafe = [];

// Split based on name
dirs.forEach((dir) => {
    var t = {
            name : dir,
            file : path.join(__dirname, `./transforms/${dir}/index.js`)
        };
    
    if(dir.indexOf("unsafe-") === 0) {
        unsafe.push(t);
    } else {
        safe.push(t);
    }
});

exports.safe   = safe;
exports.unsafe = unsafe;
