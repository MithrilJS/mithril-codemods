m({
    oninit: function() { }
});

m.mount(document.body, {
    oninit: function(vnode) {
        vnode;
        vnode.attrs.fooga;

        thing.options = vnode.attrs;
    }
});
