m.route(document.body, "/booga", {
    "/:attr": {
        view: function() {
            m.route.param("attr");
            m.route.param("invalid-identifier");
        }
    }
});
