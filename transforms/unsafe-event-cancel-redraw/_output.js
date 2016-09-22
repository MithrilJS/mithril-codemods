// Simple
m("div", {
    onclick : function(e) {
        e.redraw = false;
    }
});

// Different Arg
m("div", {
    onclick : function(f) {
        f.redraw = false;
    }
});

// Multiple Args
m("div", {
    onclick : function(e, g) {
        e.redraw = false;
    }
});

// Shouln't be transformed
function fooga() {
    m.redraw.strategy("none");
}
