#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec)

;(async () => {
  let packageVersion
  try {
    packageVersion = require('./package.json').version
  } catch (e) {
    console.error('Could not find package.json version')
    process.exit(1)
  }

  const repo = process.argv[2]

  if (!repo) {
    console.error('Please provide a docker repository')
    process.exit(1)
  }

  const { stdout } = await exec(`curl 'https://registry.hub.docker.com/v2/repositories/${repo}/tags/'`)

  const tags = JSON.parse(stdout).results.map(i => i.name)

  if (tags.includes(packageVersion) || tags.includes('v' + packageVersion)) {
    console.error('Please update the package version before publishing.')
    process.exit(1)
  }
})()
