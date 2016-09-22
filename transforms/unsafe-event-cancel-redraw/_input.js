// Simple
m("div", {
    onclick : function() {
        m.redraw.strategy("none");
    }
});

// Different Arg
m("div", {
    onclick : function(f) {
        m.redraw.strategy("none");
    }
});

// Multiple Args
m("div", {
    onclick : function(e, g) {
        m.redraw.strategy("none");
    }
});

// Shouln't be transformed
function fooga() {
    m.redraw.strategy("none");
}
