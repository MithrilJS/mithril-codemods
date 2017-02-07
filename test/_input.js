// m-module
m.module(document.body, {
    // controller
    controller : function(options) {
        var ctrl = this;

        this.field = options.field;
        
        // m-route-get-set
        this.route = m.route() || "";
        
        // query-string
        this.query = m.route.parseQueryString(query);

        this.route = function(route) {
            // m-route-get-set
            m.route(route);

            // query-string
            ctrl.query = m.route.buildQueryString({ foo : 1 });
        };

        this.computation = function() {
            // m-start-end-computation
            m.startComputation();

            // m-sync
            m.sync([
                doSomeWork(),
                doSomeOtherWork()
            ])
            // m-start-end-computation
            .then(() => {
                m.endComputation()
            });
        };

        // unsafe-component-onunload
        ctrl.onunload = onunload;
    },

    // unsafe-view
    view : function(ctrl, options) {
        return m("div",
            m("a", {
                // config-m-route
                config : m.route
            }),

            // m-component
            m.component(Component),
            m.component(Component2, { arg : 1 }),

            // svg-namespace-xlink
            m("svg",
                m("use[href='svg-attr.svg#icon']", {
                    // unsafe-config
                    config : function(el, isInit) {
                        if(!isInit) {
                            "oncreate";
                        }
                    }
                })
            ),

            // unsafe-component-wrapping
            {
                view : function() {
                    return m("div", {
                        attr : ctrl.route,
                        
                        // unsafe-config
                        config: function(el) {
                            "onupdate";
                        },

                        // unsafe-event-cancel-redraw
                        onclick : function() {
                            m.redraw.strategy("none");
                        }
                    });
                }
            }
        );
    }
});

// m-mount-vnodes
m.mount(document.body, m("div"));

// m-route-mode
m.route.mode = "pathname";

// m-route-vnodes
m.route(document.body, "/", {
    "/"  : m("div"),
    "/2" : m("div", { class : "class" })
});
