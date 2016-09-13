m.route(document.body, "/", {
    "/" : {
        view: function() {
            return m("div");
        }
    }
});
