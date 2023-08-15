#!/usr/bin/env node
const args = process.argv.slice(2);
console.log(args, 'this is args');
const {Plop, run} = require('plop');
const argv = require('minimist')(args);
const path = require('path');
Plop.launch({
	cwd: argv.cwd,
	configPath: path.resolve(__dirname, "../plopfile.js"),
	require: argv.require,
	completion: argv.completion
}, run);