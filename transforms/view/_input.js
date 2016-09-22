m.mount(document.body, {
    view : function(ctrl, options) {
        ctrl.fooga;
        options.wooga;

        thing.options = options;
        thing.ctrl = ctrl;
    }
});

// No-args shouldn't be changed
m.mount(document.body, {
    view : function() { }
});

// Should work w/ arrow fns
m.mount(document.body, {
    view : (ctrl) => m("div", ctrl.fooga)
});

// Should work on functions that take "ctrl" as their first param
function view(ctrl) {
    return m("div", ctrl.fooga);
}
