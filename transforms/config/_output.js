m("div", {
    onupdate: function() {}
});

// Runs every update
m("div", {
    onupdate: function(vnode) {
        vnode.dom.style.color = "red";
    }
});

// Do different things if element is initialized or not
m("div", {
    onupdate: function(vnode) {
        vnode.dom.style.color = "blue";
    },

    oncreate: function(vnode) {
        vnode.dom.style.color = "red";

        return;
    }
});

// do-nothing if element already initialized
m("div", {
    oncreate: function(vnode) {
        vnode.dom.style.color = "blue";
    },

    onupdate: function(vnode) {
        return;
    }
});
