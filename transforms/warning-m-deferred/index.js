"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mdeferred-removed
// Add a warning above any usage of `m.deferred()`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats,
        
        comment = j.commentBlock(" WARNING: m.deferred has been removed from mithril@1.x! ");

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "deferred" }
            }
        })
        .forEach((p) => {
            s("m.deferred");

            if(!p.value.comments) {
                p.value.comments = [];
            }

            p.value.comments.push(comment);
        })
        .toSource();
};
