#!/usr/bin/env node
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
    
    opts = Object.assign({}, {
        env : Object.assign({}, process.env, {
            PATH : path({ cwd : __dirname })
        }),
        stdio : "inherit"
    });
    
globby(cli.input.length ? cli.input : [ "**" ])
    .then((paths) => series(
        transforms,
        (transform) => {
            console.log(`Running: ${transform}`);

            return execa(
                "jscodeshift",
                [ "-t", transform, cli.run ? "" : "-d" ].concat(paths),
                opts
            );
        }
    ))
    .then((results) => results.forEach(
        (result, idx) => console.log(`${transforms[idx]} result:\n${result.stdout}`)
    ))
    .catch(console.error.bind(console));
