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
