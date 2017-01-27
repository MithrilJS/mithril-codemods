m.route.get();
m.route.set("/new-route");
m.route(document.body, "/", {});
m.route.get();
function foo() {
    return (m.route.get() || "");
}
