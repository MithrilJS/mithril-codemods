// m-module
m.mount(document.body, {
    // controller
    oninit : function(vnode) {
        var ctrl = this;

        this.field = vnode.attrs.field;

        // m-route-get-set
        this.route = m.route.get() || "";

        // query-string
        this.query = m.parseQueryString(query);

        this.route = function(route) {
            // m-route-get-set
            m.route.set(route);

            // query-string
            ctrl.query = m.buildQueryString({ foo : 1 });
        };

        this.computation = function() {
            // m-sync
            Promise.all([
                doSomeWork(),
                doSomeOtherWork()
            ])
            .then(() => {});
        };
    },

    // unsafe-view
    view : function(vnode) {
        return m("div",
            m("a", {
                oncreate: m.route.link
            }),

            m(Component),
            m(Component2, { arg : 1 }),

            // svg-namespace-xlink
            m("svg",
                m("use[xlink:href='svg-attr.svg#icon']", {
                    oncreate: function(vnode) {
                        "oncreate";
                    }
                })
            ),

            m(// unsafe-component-wrapping
            {
                view : function() {
                    return m("div", {
                        attr : vnode.state.route,
                        
                        // unsafe-config
                        onupdate: function(vnode) {
                            "onupdate";
                        },

                        // unsafe-event-cancel-redraw
                        onclick : function(e) {
                            e.redraw = false;
                        }
                    });
                }
            })
        );
    },

    onremove: onunload
});

// m-mount-vnodes
m.mount(document.body, {
    view: function() {
        return m("div");
    }
});

m.route.prefix("");

// m-route-vnodes
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
