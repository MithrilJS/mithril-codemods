"use strict";

function href(j, p) {
    return (
        j.match(p, {
            key : { name : "href" }
        }) ||
        j.match(p, {
            key : { value : "href" }
        })
    );
}

function svg(j, p) {
    var parent = p.parent;

    while(parent && !j.match(parent, {
        type      : "CallExpression",
        callee    : { name : "m" },
        arguments : [{
            value : (v) => v.indexOf("svg") === 0
        }]
    })) {
        parent = parent.parent;
    }

    return parent;
}

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#xlink-namespace-required
// Adds `xlink` namespace to `href` attributes in SVGs
module.exports = function(file, api) {
    var j = api.jscodeshift,
        parsed = j(file.source);
    
    parsed
        // m("use/image", { href : "..." })
        .find(j.CallExpression, {
            callee    : { name : "m" },
            arguments : [
                { type : "Literal" },
                {
                    type       : "ObjectExpression",
                    properties : (props) => props.some(href.bind(null, j))
                }
            ]
        })
        // Walk up parents, searching for m("svg")
        .filter(svg.bind(null, j))
        // Go through object properties and rename href to xlink:href
        .forEach((p) =>
            p.get("arguments", 1, "properties")
                .filter(href.bind(null, j))
                .forEach((prop) =>
                    prop.get("key").replace(j.literal("xlink:href"))
                )
        )
        .toSource();
    
    return parsed
        // m("use[href='...']")
        .find(j.CallExpression, {
            callee    : { name : "m" },
            arguments : [
                {
                    type  : "Literal",
                    value : (v) => v.indexOf("[href") > -1
                }
            ]
        })
        .filter(svg.bind(null, j))
        .forEach((p) =>
            p.get("arguments", 0).replace(j.literal(
                p.get("arguments", 0).getValueProperty("value").replace("[href", "[xlink:href")
            ))
        )
        .toSource();
};
