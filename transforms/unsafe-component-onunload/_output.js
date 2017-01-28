// Empty controller removal
var c = {
    onremove: function() {
        console.log("onunload");
    }
};

// Leave controller
var c2 = {
    controller : function() {
        this.prop = "value";
    },

    onremove: function() {
        console.log("onunload");
    }
};

// Arrow fns
var c3 = {
    onremove: () => console.log("onunload")
};

// Not using `this`
var c4 = {
    controller : function() {
        var ctrl = this;
    },

    onremove: function() {
        console.log("onunload");
    }
};
