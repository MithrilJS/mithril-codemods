"use strict";

var conversion = {
        search   : "?",
        hash     : "#",
        pathname : ""
    };

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mroute-mode
// Converts m.route.mode = "..." calls into m.route.prefix()
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.AssignmentExpression)
        .filter((p) => (
            p.get("left").get("object").get("object").value.name === "m" &&
            p.get("left").get("object").get("property").value.name === "route" &&
            p.get("left").get("property").get("name").value === "mode" &&
            p.get("right").value.value in conversion
        ))
        .forEach(() => s("m.route.mode"))
        .replaceWith((p) => j.callExpression(
            j.memberExpression(
                j.memberExpression(
                    j.identifier("m"),
                    j.identifier("route")
                ),
                j.identifier("prefix")
            ),
            [
                j.literal(
                    conversion[p.get("right").value.value]
                )
            ]
        ))
        .toSource();
};
