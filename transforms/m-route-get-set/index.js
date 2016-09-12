"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#readingwriting-the-current-route
// m.route() => m.route.get();
// m.route("/new-route") => m.route.set("/new-route);
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.CallExpression)
        .filter((p) => (
            p.get("callee").get("object").getValueProperty("name") === "m" &&
            p.get("callee").get("property").getValueProperty("name") === "route"
        ))
        .replaceWith((p) => {
            var args = p.get("arguments").value,
                type = "get";

            if(args.length) {
                type = "set";
            }

            return j.callExpression(
                j.memberExpression(
                    j.memberExpression(
                        j.identifier("m"),
                        j.identifier("route")
                    ),
                    j.identifier(type)
                ),
                args
            );
        })
        .toSource();
};
