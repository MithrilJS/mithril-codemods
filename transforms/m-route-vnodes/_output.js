m.route(document.body, "/", {
    "/"  : {
        view : function() {
            return m("div");
        }
    },
    "/2" : {
        view : function() {
            return m("div", { class : "class" });
        }
    }
});
