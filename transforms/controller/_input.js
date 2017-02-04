m({
    controller : function() { }
});

m.mount(document.body, {
    controller : function(options) {
        options;
        options.fooga;

        thing.options = options;

        foo(options);
        foo(thing.options);
    }
});

m.mount(document.body, {
    controller : controller
});
