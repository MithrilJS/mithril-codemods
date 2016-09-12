mithril-codemod
===============

Use [`jscodeshift`](https://github.com/facebook/jscodeshift) to help automate the transition from `mithril@0.2.x` to `mithril@1.x` based on the sections of the [Migration Guide](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md)

## Transforms

- [x] `m.component()` -> `m()`
- [x] `controller` -> `oninit`
- [x] `m.route.mode` -> `m.route.prefix()`
- [x] `m.redraw.strategy("none")` -> `e.redraw = false`
- [x] `m.route()`/`m.route("route")` -> `m.route.get()`/`m.route.set("route")`
- [x] `config: m.route` -> `oncreate: m.route.link`
- [ ] Component options -> `vnode.attrs`
- [ ] `m.route.param()` -> `vnode.attrs`

## Potentially Unsafe Transforms

- [ ] Unwrapped components -> Wrapped components
- [ ] `config` -> `onupdate`
- [ ] Raw vnodes in `m.mount()`/`m.route()` -> Component wrapped vnodes
- [ ] `m.request().then()` -> `m.request().run()`
