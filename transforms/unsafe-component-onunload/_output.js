// Empty controller removal
var c = {
    onremove: function() {
        console.log("onunload");
    }
};

// Leave controller
var c = {
    controller : function() {
        this.prop = "value";
    },

    onremove: function() {
        console.log("onunload");
    }
};

// Arrow fns
var c = {
    onremove: () => console.log("onunload")
};

// Not using `this`
var c = {
    controller : function() {
        var ctrl = this;
    },

    onremove: function() {
        console.log("onunload");
    }
};

// Reference
var c = {
    onremove: reference
};

var c = {
    controller : function() {
        otherFunc();
    },

    onremove: reference
};
