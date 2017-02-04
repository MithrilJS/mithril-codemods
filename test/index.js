"use strict";

var fs   = require("fs"),

    o         = require("ospec"),
    execa     = require("execa"),
    disparity = require("disparity"),
    
    transforms = require("../index.js");

function noop() { }

o.spec("mithril-codemod", () => {
    Object.keys(transforms).forEach((type) =>
        o.spec(type, () =>
            transforms[type].forEach((t) => {
                var transform = require(t.file),
                    
                    fn = transform.only ? o.only : o;
                
                fn(t.name, () => {
                    var input = `./transforms/${t.name}/_input.js`,
                        result, diff;
                    
                    result = transform({
                        path   : input,
                        source : fs.readFileSync(input, "utf8")
                    }, {
                        jscodeshift : require("jscodeshift"),
                        
                        stats : noop
                    });

                    diff = disparity.unified(
                        fs.readFileSync(`./transforms/${t.name}/_output.js`, "utf8").trim(),
                        result.trim(),
                        {
                            paths : [
                                `/transforms/${t.name}/_input.js (transformed)`,
                                `./transforms/${t.name}/_output.js`
                            ]
                        }
                    );

                    o(diff).equals("")(`\n${diff}`);
                })
            })
        )
    );
});

o.run();
