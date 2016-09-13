mithril-codemod
===============

Use [`jscodeshift`](https://github.com/facebook/jscodeshift) to help automate the transition from `mithril@0.2.x` to `mithril@1.x` based on the sections of the [Migration Guide](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md)

## Transforms

- [x] `m.component()` 👉🏻 `m()` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mcomponent-removed)
- [x] `controller` 👉🏻 `oninit` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-controller-function)
- [x] `m.route.mode` 👉🏻 `m.route.prefix()` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mroutemode)
- [x] `m.redraw.strategy("none")` 👉🏻 `e.redraw = false` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#cancelling-redraw-from-event-handlers)
- [x] `m.route()`/`m.route("route")` 👉🏻 `m.route.get()`/`m.route.set("route")` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#readingwriting-the-current-route)
- [x] `config: m.route` 👉🏻 `oncreate: m.route.link` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mroute-and-anchor-tags)
- [x] `m.route.param()` 👉🏻 `vnode.attrs` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#accessing-route-params)
- [x] Raw vnodes in `m.mount()`/`m.route()` 👉🏻 Component wrapped vnodes [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#passing-vnodes-to-mmount-and-mroute)
- [x] Component options 👉🏻 `vnode.attrs` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-arguments)
- [x] ⚠️ `m()` unwrapped components 👉🏻 wrapped components️ [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#passing-components-to-m)
- [ ] ⚠️ `config` 👉🏻 `onupdate` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#config-function)
- [ ] ⚠️ `m.request().then()` 👉🏻 `m.request().run()` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mrequest)

## Key

- ⚠️ Potentially unsafe transform
- 📓 Mithril rewrite migration docs
