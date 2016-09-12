mithril-codemod
===============

Use [`jscodeshift`](https://github.com/facebook/jscodeshift) to help automate the transition from `mithril@0.2.x` to `mithril@1.x` based on the sections of the [Migration Guide](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md)

## Transforms

- [x] `m.component()` :point_right: `m()`
- [x] `controller` :point_right: `oninit`
- [x] `m.route.mode` :point_right: `m.route.prefix()`
- [x] `m.redraw.strategy("none")` :point_right: `e.redraw = false`
- [ ] `config` :point_right: `onupdate` :warning:
- [ ] Component options :point_right: `vnode.attrs`
- [ ] Unwrapped components :point_right: Wrapped components :warning:
- [ ] Raw vnodes in `m.mount()`/`m.route()` :point_right: Component wrapped vnodes :warning:
- [ ] `m.route()`/`m.route(<new-route>)` :point_right: `m.route.get()`/`m.route.set(<new-route>)`
- [ ] `m.route.param()` :point_right: `vnode.attrs`
- [ ] `config: m.route` :point_right: `oncreate: m.route.link`
- [ ] `m.request().then()` :point_right: `m.request().run()` :warning:

### Key

- :warning: May result in an unsafe transform
- :blue_book: Mithril migration doc reference
