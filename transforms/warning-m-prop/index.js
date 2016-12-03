"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mprop-removed
// Add a warning around any usage of `m.prop()`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats,
        
        comment = j.commentBlock(" WARNING: m.prop has been removed from mithril@1.x! ");

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "prop" }
            }
        })
        .forEach((p) => {
            s("m.prop");

            if(!p.value.comments) {
                p.value.comments = [];
            }

            p.value.comments.push(comment);
        })
        .toSource();
};
