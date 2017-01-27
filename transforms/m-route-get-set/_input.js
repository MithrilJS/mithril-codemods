m.route();
m.route("/new-route");
m.route(document.body, "/", {});
m.route.get();
function foo() {
    return (m.route() || "");
}
