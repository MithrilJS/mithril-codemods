"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mcomponent-removed
// Convert `m.module()` invocations into `m.mount()`
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.MemberExpression, {
            object   : { name : "m" },
            property : { name : "module" }
        })
        .replaceWith((p) => {
            p.node.property.name = "mount";
            
            return p.node;
        })
        .toSource();
};
