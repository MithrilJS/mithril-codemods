"use strict";

// https://mithril.js.org/change-log.md#readingwriting-the-current-route
// m.route() => m.route.get();
// m.route("/new-route") => m.route.set("/new-route);
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "route" }
            },

            arguments : (node) => node.length < 2
        })
        .forEach(() => s('m.route()/m.route("/route")'))
        .replaceWith((p) => (
            p.get("arguments").getValueProperty("length") ?
                j.template.expression`
                    m.route.set(${p.get("arguments").value})
                ` :
                j.template.expression`
                    m.route.get()
                `
            )
        )
        .toSource();
};
