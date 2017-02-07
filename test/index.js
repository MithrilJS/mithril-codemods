"use strict";

var fs   = require("fs"),

    o         = require("ospec"),
    execa     = require("execa"),
    disparity = require("disparity"),
    jscodeshift = require("jscodeshift"),
    
    transforms = require("../index.js");

function stats() { }

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
                        jscodeshift,
                        stats
                    });

                    diff = disparity.unified(
                        fs.readFileSync(`./transforms/${t.name}/_output.js`, "utf8").trim(),
                        result.trim(),
                        {
                            paths : [
                                `./transforms/${t.name}/_input.js (transformed)`,
                                `./transforms/${t.name}/_output.js`
                            ]
                        }
                    );

                    o(diff).equals("")(`\n${diff}`);
                })
            })
        )
    );

    o("Multiple transforms", () => {
        var tasks  = transforms.safe.concat(transforms.unsafe, transforms.warning),
            source = fs.readFileSync("./test/_input.js", "utf8"),
            diff;

        tasks.forEach((t) => {
            source = require(t.file)({
                path   : "./test/_input.js",
                source : source
            }, {
                jscodeshift,
                stats
            });
        });

        diff = disparity.unified(
            fs.readFileSync(`./test/_output.js`, "utf8").trim(),
            source.trim(),
            {
                paths : [
                    "./test/_input.js (transformed)",
                    "./test/_output.js"
                ]
            }
        );

        o(diff).equals("")(`\n${diff}`);
    });
});

o.run();
