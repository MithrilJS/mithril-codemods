"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#readingwriting-the-current-route
// m.route() => m.route.get();
// m.route("/new-route") => m.route.set("/new-route);
module.exports = (file, api) => {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "route" }
            },

            arguments : (node) => node.length < 2
        })
        .replaceWith((p) => j.callExpression(
            j.memberExpression(
                j.memberExpression(
                    j.identifier("m"),
                    j.identifier("route")
                ),
                j.identifier(
                    p.get("arguments").getValueProperty("length") ? "set" : "get"
                )
            ),
            p.get("arguments").value
        ))
        .toSource();
};
