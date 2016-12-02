"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mroute-and-anchor-tags
// Convert `config : m.route` into `oncreate : m.route.link`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key   : { name : "config" },
            value : {
                object   : { name : "m" },
                property : { name : "route" }
            }
        })
        .forEach(() => s("config: m.route"))
        .replaceWith(() => j.property(
            "init",
            j.identifier("oncreate"),
            j.memberExpression(
                j.memberExpression(
                    j.identifier("m"),
                    j.identifier("route")
                ),
                j.identifier("link")
            )
        ))
        .toSource();
};
