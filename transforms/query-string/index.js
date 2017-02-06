"use strict";

// https://github.com/tivac/mithril-codemods/issues/30
// m.route.buildQueryString() => m.buildQueryString();
// m.route.parseQueryString() => m.parseQueryString();
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object : {
                    object   : { name : "m" },
                    property : { name : "route" }
                },
                property : (prop) => prop.name === "buildQueryString" || prop.name === "parseQueryString"
            }
        })
        .forEach(() => s("m.route.buildQueryString()/m.route.parseQueryString()"))
        .replaceWith((p) => j.template.expression`
            m.${p.get("callee", "property", "name").value}(${p.get("arguments").value})
        `)
        .toSource();
};
