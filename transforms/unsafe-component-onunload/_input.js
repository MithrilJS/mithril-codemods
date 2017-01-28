// Empty controller removal
var c = {
    controller : function() {
        this.onunload = function() {
            console.log("onunload");
        };
    }
};

// Leave controller
var c2 = {
    controller : function() {
        this.prop = "value";

        this.onunload = function() {
            console.log("onunload");
        };
    }
};

// Arrow fns
var c3 = {
    controller : function() {
        this.onunload = () => console.log("onunload");
    }
};

// Not using `this`
var c4 = {
    controller : function() {
        var ctrl = this;

        ctrl.onunload = function() {
            console.log("onunload");
        }
    }
};
