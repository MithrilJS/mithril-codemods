"use strict";

var fs   = require("fs"),
    path = require("path"),
    
    dirs = fs.readdirSync(path.join(__dirname, "/transforms")),
    
    prefixes = [
        "unsafe",
        "warning"
    ],

    out = {};

// Split based on name
dirs.forEach((dir) => {
    var prefix = dir.split("-")[0],

        transform = {
            name : dir,
            file : path.join(__dirname, `./transforms/${dir}/index.js`)
        };
        
    
    if(prefixes.indexOf(prefix) === -1) {
        prefix = "safe";
    }
    
    if(!out[prefix]) {
        out[prefix] = [];
    }

    return out[prefix].push(transform);
});

module.exports = out;
