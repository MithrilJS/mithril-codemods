m.mount(
    document.body,
    m("div", {
        config : m.route
    }, {
        view : () => m("view")
    })
);
