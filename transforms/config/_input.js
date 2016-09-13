m("div", {
    config: function() {}
});

m("div", {
    config: function(el) {
        el.style.color = "red";
    }
});

m("div", {
    config: function(el, init) {
        if(!init) {
            el.style.color = "red";

            return;
        }

        el.style.color = "blue";
    }
});
