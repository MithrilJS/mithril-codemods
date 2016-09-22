m("div", {
    config: function(el) {
        el.fooga;
        fooga.el;
    }
});

m("div", {
    config: function(el) {
        "onupdate";
    }
});

m("div", {
    config : function(el, init) {
        if(!init) {
            "oncreate";
        }
    }
});

m("div", {
    config: function(el, init) {
        if(!init) {
            "oncreate";

            return;
        }

        "onupdate";
    }
});

m("div", {
    config: function(el, init) {
        if(init) {
            return;
        }

        "oncreate";
    }
});
