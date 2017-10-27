#!/usr/bin/env node

const util = require('util');
const packageVersion = require('./package.json').version
const exec = util.promisify(require('child_process').exec)

;(async () => {
  const repo = process.argv[2]
  const { stdout } = await exec(`curl 'https://registry.hub.docker.com/v2/repositories/${repo}/tags/'`)

  const tags = JSON.parse(stdout).results.map(i => i.name)

  if (tags.includes(packageVersion) || tags.includes('v' + packageVersion)) {
    console.error('Please update the package version before publishing.')
    process.exit(1)
  }
})()
