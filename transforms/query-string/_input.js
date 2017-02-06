m.route.buildQueryString({
    s : "s"
});

var parsed = m.route.parseQueryString("s=s");

wrapper(`query?${m.route.buildQueryString({ a : "b" })}`);
