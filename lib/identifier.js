"use strict";

// Update references to child identifiers
exports.replace = function(j, root, find, replace) {
    j(root)
        .find(j.Identifier, { name : find })
        // Ensure that `arg` is the object being modified
        // Means that fooga.<arg> will be ignored, but <arg>.fooga will be modified
        .filter((p2) => (j.MemberExpression.check(p2.parent.node) ?
            p2.parent.get("object") === p2 :
            true
        ))
        .replaceWith(replace);
};
