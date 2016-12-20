"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#preventing-unmounting
// Finds .onunload functions that can call e.preventDefault() and adds a warning
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats,
        
        comment = j.commentBlock(" WARNING: onunload cannot cancel unmounting in mithril@1.x ");

    return j(file.source)
        .find(j.AssignmentExpression, {
            left : {
                type     : "MemberExpression",
                property : { name : "onunload" }
            }
        })
        .forEach((p) => {
            var found;

            j(p.getValueProperty("right"))
                .find(j.MemberExpression, {
                    property : { name : "preventDefault" }
                })
                .forEach(() => (found = true));
            
            // No-op if the onunload handler has no preventDefault logic
            if(!found) {
                return;
            }
            
            s("onunload preventDefault");

            if(!p.value.comments) {
                p.value.comments = [];
            }

            p.value.comments.push(comment);
        })
        .toSource();
};
