mithril-codemods [![NPM Version](https://img.shields.io/npm/v/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods) [![NPM License](https://img.shields.io/npm/l/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
================
[![NPM Downloads](https://img.shields.io/npm/dm/mithril-codemods.svg)](https://www.npmjs.com/package/mithril-codemods)
[![Build Status](https://img.shields.io/travis/tivac/mithril-codemods.svg)](https://travis-ci.org/tivac/mithril-codemods)
[![Dependency Status](https://img.shields.io/david/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods)
[![devDependency Status](https://img.shields.io/david/dev/tivac/mithril-codemods.svg)](https://david-dm.org/tivac/mithril-codemods#info=devDependencies)

Automated porting of `mithril@0.2` code to `mithril@1.0`.

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

These transforms are pretty safe and unlikely to have many false positives.

- [Replace `m.component()` with `m()`](http://mithril.js.org/change-log.html#mcomponent-removed)
- [Rename `controller`️ to `oninit`](http://mithril.js.org/change-log.html#component-controller-function)
- [Rename `m.route.mode` to `m.route.prefix()` and adjust args](http://mithril.js.org/change-log.html#mroutemode)
- [Rename `m.route()` to `m.route.get()` and `m.route("route")` to `m.route.set("route")`](http://mithril.js.org/change-log.html#readingwriting-the-current-route)
- [Replace `config: m.route` ️w️i️t️h️ `oncreate: m.route.link`](http://mithril.js.org/change-log.html#mroute-and-anchor-tags)
- [Wrap raw vnodes in `m.mount()`/`m.route()`](http://mithril.js.org/change-log.html#passing-vnodes-to-mmount-and-mroute)
- [Replace `options` with `vnode.attrs`](http://mithril.js.org/change-log.html#component-arguments)
- [Add `xlink` namespacing to `<svg>`](http://mithril.js.org/change-log.html#xlink-namespace-required)
- [Replace `m.sync` with `Promise.all`](http://mithril.js.org/change-log.html#msync-removed)
- [Remove `m.startComputation`/`m.endComputation`](http://mithril.js.org/change-log.html#no-more-redraw-locks)
- [Replace `m.route.build/parseQueryString` with `m.build/parseQueryString`](http://mithril.js.org/change-log.html#buildingparsing-query-strings)

### ⚠️️️ Unsafe ⚠️

These transform are usually fine, but not applied by default since they can have unfortunate side-effects.

- [Convert `m.redraw.strategy("none")` to `e.redraw = false`](http://mithril.js.org/change-log.html#cancelling-redraw-from-event-handlers)
- [Wrap unwrapped components](http://mithril.js.org/change-log.html#passing-components-to-m)
- [Replace `config` with `oninit`/`onupdate`](http://mithril.js.org/change-log.html#config-function)
- [Rewrite `view(ctrl, options)` as `view(vnode)`](http://mithril.js.org/change-log.html#view-parameters)

### Warnings

There are certain classes of changes that are impossible to automatically convert.

- [`m.prop` removed](http://mithril.js.org/change-log.html#mprop-removed)
- [`m.redraw(true)` removed](http://mithril.js.org/change-log.html#synchronous-redraw-removed)
- [`m.deferred()` removed](http://mithril.js.org/change-log.html#mdeferred-removed)
- [`onunload` preventing unmounting](http://mithril.js.org/change-log.html#preventing-unmounting)
