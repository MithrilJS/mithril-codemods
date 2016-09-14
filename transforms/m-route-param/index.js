"use strict";

var identifier = require("to-js-identifier");

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#accessing-route-params
// Converts m.route.param(<param>) to vnode.attrs.<param>
//
// TODO: Doesn't automatically add vnode param is missing
// TODO: Doesn't respect existing vnode param name
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.CallExpression)
        .filter((p) => (
            p.get("callee", "object").value &&
            p.get("callee", "object", "object").value &&
            p.get("callee", "object", "object").getValueProperty("name") === "m" &&
            p.get("callee", "object", "property").value &&
            p.get("callee", "object", "property").getValueProperty("name") === "route" &&
            p.get("callee", "property").value &&
            p.get("callee", "property").getValueProperty("name") === "param"
        ))
        .replaceWith((p) => {
            var prop = p.get("arguments", 0).getValueProperty("value");
            
            return j.memberExpression(
                j.memberExpression(
                    j.identifier("vnode"),
                    j.identifier("attrs")
                ),
                identifier(prop) === prop ?
                    j.identifier(prop) :
                    j.literal(prop)
            );
        })
        .toSource();
};
