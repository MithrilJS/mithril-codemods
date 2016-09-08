"use strict";

var fs   = require("fs"),

    o = require("ospec"),
    
    transforms = fs.readdirSync("./transforms");

o.spec("mithril-codemod", () => {
    transforms.forEach((t) => o(t, () => {
        var fn    = require(`../transforms/${t}/`),
            input = `./transforms/${t}/_input.js`,
            result;
        
        result = fn({
            path   : input,
            source : fs.readFileSync(input, "utf8")
        }, {
            jscodeshift : require("jscodeshift")
        });

        o(result).equals(fs.readFileSync(`./transforms/${t}/_output.js`, "utf8"));
    }));
});


o.run();
