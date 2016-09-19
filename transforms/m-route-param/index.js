"use strict";

var identifier = require("to-js-identifier");

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#accessing-route-params
// Converts m.route.param(<param>) to vnode.attrs.<param>
//
// TODO: Doesn't automatically add vnode param if missing
// TODO: Doesn't respect existing vnode param name
//      Those are both really hard to solve because finding the correct function scope
//      to use is tricky at best
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object : {
                    object   : { name : "m" },
                    property : { name : "route" }
                },

                property : { name : "param" }
            }
        })
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
