m({
    oninit : function() { }
});

m.mount(document.body, {
    oninit : function(vnode) {
        vnode.attrs;
        vnode.attrs.fooga;

        thing.options = vnode.attrs;

        foo(vnode.attrs);
        foo(thing.options);
    }
});
