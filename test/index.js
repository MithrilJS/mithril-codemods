"use strict";

var fs   = require("fs"),

    o         = require("ospec"),
    disparity = require("disparity"),
    
    transforms = fs.readdirSync("./transforms");

function noop() { }

o.spec("mithril-codemod", () => {
    transforms.forEach((t) => o(t, () => {
        var fn    = require(`../transforms/${t}/`),
            input = `./transforms/${t}/_input.js`,
            result, diff;
        
        result = fn({
            path   : input,
            source : fs.readFileSync(input, "utf8")
        }, {
            jscodeshift : require("jscodeshift"),
            
            stats : noop
        });

        diff = disparity.unified(fs.readFileSync(`./transforms/${t}/_output.js`, "utf8").trim(), result.trim(), {
            paths : [
                `/transforms/${t}/_input.js (transformed)`,
                `./transforms/${t}/_output.js`
            ]
        });

        o(diff).equals("")(`\n${diff}`);
    }));
});


o.run();
