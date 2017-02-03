mithril-codemods [![NPM Version](https://img.shields.io/npm/v/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods) [![NPM License](https://img.shields.io/npm/l/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
================
[![NPM Downloads](https://img.shields.io/npm/dm/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
[![Build Status](https://img.shields.io/travis/tivac/mithril-codemods.svg)](https://travis-ci.org/tivac/mithril-codemods)
[![Dependency Status](https://img.shields.io/david/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods)
[![devDependency Status](https://img.shields.io/david/dev/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods#info=devDependencies)

Use [`jscodeshift`](https://github.com/facebook/jscodeshift) to help automate the transition from `mithril@0.2.x` to `mithril@1.x` based on the sections of the [Migration Guide](http://mithril.js.org/change-log.html)

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

- [x] `m.component()` ➡️ `m()` [📓](http://mithril.js.org/change-log.html#mcomponent-removed)
- [x] `controller` ➡️ `oninit` [📓](http://mithril.js.org/change-log.html#component-controller-function)
- [x] `m.route.mode` ➡️ `m.route.prefix()` [📓](http://mithril.js.org/change-log.html#mroutemode)
- [x] `m.route()`/`m.route("route")` ➡️ `m.route.get()`/`m.route.set("route")` [📓](http://mithril.js.org/change-log.html#readingwriting-the-current-route)
- [x] `config: m.route` ➡️ `oncreate: m.route.link` [📓](http://mithril.js.org/change-log.html#mroute-and-anchor-tags)
- [x] `m.route.param()` ➡️ `vnode.attrs` [📓](http://mithril.js.org/change-log.html#accessing-route-params)
- [x] Raw vnodes in `m.mount()`/`m.route()` ➡️ Component wrapped vnodes [📓](http://mithril.js.org/change-log.html#passing-vnodes-to-mmount-and-mroute)
- [x] Component options ➡️ `vnode.attrs` [📓](http://mithril.js.org/change-log.html#component-arguments)
- [x] svg `xlink` namespacing [📓](http://mithril.js.org/change-log.html#xlink-namespace-required)
- [x] `m.sync` ➡️ `Promise.all` [📓](http://mithril.js.org/change-log.html#msync-removed)
- [x] `m.startComputation`/`m.endComputation` removed [📓](http://mithril.js.org/change-log.html#no-more-redraw-locks)

## Unsafe Transforms

- [x] ⚠️ `m.redraw.strategy("none")` ➡️ `e.redraw = false` [📓](http://mithril.js.org/change-log.html#cancelling-redraw-from-event-handlers)
- [x] ⚠️ `m()` unwrapped components ➡️ wrapped components️ [📓](http://mithril.js.org/change-log.html#passing-components-to-m)
- [x] ⚠️ `config` ➡️ `oninit`/`onupdate` [📓](http://mithril.js.org/change-log.html#config-function)
- [x] ⚠️ `view(ctrl, options)` ➡️ `view(vnode)` [📓](http://mithril.js.org/change-log.html#view-parameters)

## Warnings

- [`m.prop` removed](http://mithril.js.org/change-log.html#mprop-removed)
- [`m.redraw(true)` removed](http://mithril.js.org/change-log.html#synchronous-redraw-removed)
- [`m.deferred()` removed](http://mithril.js.org/change-log.html#mdeferred-removed)
- [`onunload` preventing unmounting](http://mithril.js.org/change-log.html#preventing-unmounting)
