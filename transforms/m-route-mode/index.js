"use strict";

var conversion = {
        search   : "?",
        hash     : "#",
        pathname : ""
    };

// https://mithril.js.org/change-log.md#mroute-mode
// Converts m.route.mode = "..." calls into m.route.prefix()
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;
    
    return j(file.source)
        .find(j.ExpressionStatement, {
            expression : {
                operator : "=",

                left : {
                    object : {
                        object   : { name : "m" },
                        property : { name : "route" }
                    },

                    property : { name : "mode" }
                },

                right : (node) => (node.value in conversion)
            }
        })
        .forEach(() => s("m.route.mode"))
        .replaceWith((p) => j.template.statement`
            m.route.prefix(${j.literal(conversion[p.get("expression", "right").getValueProperty("value")])});
        `)
        .toSource();
};
