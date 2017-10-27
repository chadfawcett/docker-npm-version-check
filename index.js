#!/usr/bin/env node

const util = require('util');
const packageVersion = require('./package.json').version
const exec = util.promisify(require('child_process').exec)

;(async () => {
  const { stdout } = await exec("curl 'https://registry.hub.docker.com/v2/repositories/library/rethinkdb/tags/'")

  const tags = JSON.parse(stdout).results.map(i => i.name)

  if (tags.includes(packageVersion)) {
    console.error('Please update the package version before publishing.')
    process.exit(1)
  }
})()
