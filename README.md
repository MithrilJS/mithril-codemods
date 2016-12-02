mithril-codemods [![NPM Version](https://img.shields.io/npm/v/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods) [![NPM License](https://img.shields.io/npm/l/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
================
[![NPM Downloads](https://img.shields.io/npm/dm/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
[![Build Status](https://img.shields.io/travis/tivac/mithril-codemods.svg)](https://travis-ci.org/tivac/mithril-codemods)
[![Dependency Status](https://img.shields.io/david/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods)
[![devDependency Status](https://img.shields.io/david/dev/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods#info=devDependencies)

Use [`jscodeshift`](https://github.com/facebook/jscodeshift) to help automate the transition from `mithril@0.2.x` to `mithril@1.x` based on the sections of the [Migration Guide](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md)

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
mithril-codemods -ua **/*.js
```

## Safe Transforms

- [x] `m.component()` 👉🏻 `m()` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mcomponent-removed)
- [x] `controller` 👉🏻 `oninit` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-controller-function)
- [x] `m.route.mode` 👉🏻 `m.route.prefix()` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mroutemode)
- [x] `m.route()`/`m.route("route")` 👉🏻 `m.route.get()`/`m.route.set("route")` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#readingwriting-the-current-route)
- [x] `config: m.route` 👉🏻 `oncreate: m.route.link` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mroute-and-anchor-tags)
- [x] `m.route.param()` 👉🏻 `vnode.attrs` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#accessing-route-params)
- [x] Raw vnodes in `m.mount()`/`m.route()` 👉🏻 Component wrapped vnodes [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#passing-vnodes-to-mmount-and-mroute)
- [x] Component options 👉🏻 `vnode.attrs` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-arguments)
- [x] svg `xlink` namespacing [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#xlink-namespace-required)

## Unsafe Transforms

- [x] ⚠️ `m.redraw.strategy("none")` 👉🏻 `e.redraw = false` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#cancelling-redraw-from-event-handlers)
- [x] ⚠️ `m()` unwrapped components 👉🏻 wrapped components️ [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#passing-components-to-m)
- [x] ⚠️ `config` 👉🏻 `oninit`/`onupdate` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#config-function)
- [x] ⚠️ `m.sync` 👉🏻 `Promise.all` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#msync-removed)
- [x] ⚠️ `view(ctrl, options)` 👉🏻 `view(vnode)` [📓](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#view-parameters)

## Impossible Transforms

- [Preventing Unmounting](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#preventing-unmounting)
- [`m.prop` removed](https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mprop-removed)

