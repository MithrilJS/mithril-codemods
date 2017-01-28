mithril-codemods [![NPM Version](https://img.shields.io/npm/v/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods) [![NPM License](https://img.shields.io/npm/l/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
================
[![NPM Downloads](https://img.shields.io/npm/dm/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
[![Build Status](https://img.shields.io/travis/tivac/mithril-codemods.svg)](https://travis-ci.org/tivac/mithril-codemods)
[![Dependency Status](https://img.shields.io/david/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods)
[![devDependency Status](https://img.shields.io/david/dev/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods#info=devDependencies)

Use [`jscodeshift`](https://github.com/facebook/jscodeshift) to help automate the transition from `mithril@0.2.x` to `mithril@1.x` based on the sections of the [Migration Guide](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md)

## Usage

```
> npm i -g mithril-codemods
> mithril-codemods --help

Usage
    $ mithril-codemods [<file|glob> ...]

Options
    --unsafe, -u    Use unsafe transforms
    --apply,  -a    Apply transforms (instead of a dry run)

Examples
    mithril-codemods **/*.js
    mithril-codemods --apply **/*.js
    mithril-codemods -ua some/specific/file.js
```

## Transforms

### Safe

[Replace `m.component()` with `m()`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mcomponent-removed)

```js
m.component(component, { arg : "1" });

// becomes

m(component, { arg : "1" });
```

[Rename `controller`️ to `oninit`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#component-controller-function)

```js
m.mount(document.body, {
    controller : function(options) {
        // ...
    }
});

// becomes
m.mount(document.body, {
    oninit : function(vnode) {
        // ...
    }
});
```

[Rename `m.route.mode` to `m.route.prefix()` and adjust args](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mroutemode)
[Rename `m.route()`/`m.route("route")` to `m.route.get()`/`m.route.set("route")`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#readingwriting-the-current-route)
[Replace `config: m.route` ️w️i️t️h️ `oncreate: m.route.link`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mroute-and-anchor-tags)
[Replace `m.route.param()` with `vnode.attrs`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#accessing-route-params)
[Wrap raw vnodes in `m.mount()`/`m.route()`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#passing-vnodes-to-mmount-and-mroute)
[Replace `options` with `vnode.attrs`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#component-arguments)
[Add `xlink` namespacing to `<svg>`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#xlink-namespace-required)
[Replace `m.sync` with `Promise.all`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#msync-removed)
[Remove `m.startComputation`/`m.endComputation`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#no-more-redraw-locks)

### ⚠️️️ Unsafe ⚠️

[Convert `m.redraw.strategy("none")` to `e.redraw = false`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#cancelling-redraw-from-event-handlers)
[Wrap unwrapped components](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#passing-components-to-m)
[Replace `config` with `oninit`/`onupdate`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#config-function)
[Rewrite `view(ctrl, options)` as `view(vnode)`](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#view-parameters)

### Warnings

[`m.prop` removed](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mprop-removed)
[`m.redraw(true)` removed](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#synchronous-redraw-removed)
[`m.deferred()` removed](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mdeferred-removed)
[`onunload` preventing unmounting](https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#preventing-unmounting)
