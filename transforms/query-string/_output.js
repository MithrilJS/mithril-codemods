m.buildQueryString({
    s : "s"
});

var parsed = m.parseQueryString("s=s");

wrapper(`query?${m.buildQueryString({ a : "b" })}`);
