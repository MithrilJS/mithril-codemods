m.mount(document.body, {
    view : function(vnode) {
        vnode.state.fooga;
        vnode.attrs.wooga;

        thing.options = vnode.attrs;
        thing.ctrl = vnode.state;
    }
});

// No-args shouldn't be changed
m.mount(document.body, {
    view : function() { }
});

// Should work w/ arrow fns
m.mount(document.body, {
    view : (vnode) => m("div", vnode.state.fooga)
});

// Should work on functions that take "ctrl" as their first param
function view(vnode) {
    return m("div", vnode.state.fooga);
}
