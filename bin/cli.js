#!/usr/bin/env node
/* eslint no-console:"off" */
"use strict";

var path = require("path"),

    meow   = require("meow"),
    execa  = require("execa"),
    globby = require("globby"),
    series = require("promise-map-series"),

    transforms = require("../"),
    
    cli = meow(`
        Usage
        $ mithril-codemods [<file|glob> ...]

        Options
        --unsafe, -u    Use unsafe transforms
        --apply,  -a    Apply transforms (instead of a dry run)

        Examples
        mithril-codemods **/*.js
        mithril-codemods --apply **/*.js
        mithril-codemods -ua **/*.js
    `, {
        boolean : [ "unsafe", "apply" ],
        string  : [ "_" ],
        alias   : {
            a : "apply",
            u : "unsafe",
            h : "help"
        }
    });

if(!cli.input.length) {
    cli.showHelp();

    return;
}

globby(cli.input)
    .then((paths) => series(
        cli.flags.unsafe ?
            transforms.safe.concat(transforms.unsafe) :
            transforms.safe,
        (transform) => {
            console.log(`${transform.name} running`);

            return execa(
                path.resolve(__dirname, "../node_modules/.bin/jscodeshift"),
                [ "-t", transform.file, cli.flags.apply ? "" : "-d" ].concat(paths),
                { stdio : "inherit" }
            )
            .then((result) => console.log(`${result.stdout}\n`))
            .catch(console.error.bind(console));
        }
    ));
