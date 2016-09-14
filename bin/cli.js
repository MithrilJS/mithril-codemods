#!/usr/bin/env node
/* eslint no-console:"off" */
"use strict";

var meow   = require("meow"),
    execa  = require("execa"),
    path   = require("npm-run-path"),
    globby = require("globby"),
    series = require("promise-map-series"),

    transforms = require("../"),
    
    cli = meow(`
        Usage
        $ mithril-codemods [<file|glob> ...]

        Options
        --unsafe, -u    Use unsafe transforms
        --run,    -r    Run transforms
    `, {
        boolean : [ "unsafe", "run" ],
        string  : [ "_" ],
        alias   : {
            u : "unsafe",
            r : "run",
            h : "help"
        }
    }),
    
    opts = {
        stdio : "inherit",
        env   : Object.assign({}, process.env, {
            PATH : path({ cwd : __dirname })
        })
    };
    
globby(cli.input.length ? cli.input : [ "**" ])
    .then((paths) => series(
        transforms,
        (transform) => {
            console.log(`${transform} running`);

            return execa(
                "jscodeshift",
                [ "-t", transform, cli.run ? "" : "-d" ].concat(paths),
                opts
            )
            .then((result) => console.log(`${transform} complete\n`, result.stdout, `\n`));
        }
    ));
