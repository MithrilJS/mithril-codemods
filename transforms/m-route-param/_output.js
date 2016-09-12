m.route(document.body, "/booga", {
    "/:attr": {
        view: function() {
            vnode.attrs.attr;
            vnode.attrs["invalid-identifier"];
        }
    }
});
