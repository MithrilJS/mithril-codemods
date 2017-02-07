// Empty controller removal
var c = {
    controller : function() {
        this.onunload = function() {
            console.log("onunload");
        };
    }
};

// Leave controller
var c = {
    controller : function() {
        this.prop = "value";

        this.onunload = function() {
            console.log("onunload");
        };
    }
};

// Arrow fns
var c = {
    controller : function() {
        this.onunload = () => console.log("onunload");
    }
};

// Not using `this`
var c = {
    controller : function() {
        var ctrl = this;

        ctrl.onunload = function() {
            console.log("onunload");
        }
    }
};

// Reference
var c = {
    controller : function() {
        this.onunload = reference;
    }
};

var c = {
    controller : function() {
        otherFunc();

        this.onunload = reference;
    }
};
