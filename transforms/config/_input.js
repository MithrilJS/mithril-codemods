m("div", {
    config: function() {}
});

// Runs every update
m("div", {
    config: function(el) {
        el.style.color = "red";
    }
});

// Do different things if element is initialized or not
m("div", {
    config: function(el, init) {
        if(!init) {
            el.style.color = "red";

            return;
        }

        el.style.color = "blue";
    }
});

// do-nothing if element already initialized
m("div", {
    config: function(el, init) {
        if(init) {
            return;
        }

        el.style.color = "blue";
    }
});
