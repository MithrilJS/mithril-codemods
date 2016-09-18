m("div", {
    onupdate: function() {}
});

m("div", {
    onupdate: function(vnode) {
        vnode.dom.style.color = "red";
    }
});

m("div", {
    onupdate: function(vnode) {
        vnode.dom.style.color = "blue";
    },

    oncreate: function(vnode) {
        vnode.dom.style.color = "red";

        return;
    }
});
