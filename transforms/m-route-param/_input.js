m.route(document.body, "/booga", {
    "/:attr": {
        view: function() {
            m.route.param("attr");
            m.route.param("invalid-identifier");
            m.route.param(identifier);
            m.route.param("foo" + bar);
        }
    }
});
