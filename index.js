#!/usr/bin/env node

const util = require('util');
let exec
try {
  const test = require('child_process')
  console.log({test})
  exec = util.promisify(test.exec)
} catch (e) {
  console.log({e})
}

console.log(exec())

try {
;(async () => {
  let packageVersion
  try {
    packageVersion = require('./package.json').version
  } catch (e) {
    console.error('Could not find package.json version')
    return process.exit(1)
  }

  const repo = process.argv[2]

  if (!repo) {
    console.error('Please provide a docker repository')
    return process.exit(1)
  }

  const { stdout } = await exec(`curl 'https://registry.hub.docker.com/v2/repositories/${repo}/tags/'`)
  console.log(stdout)

  const tags = JSON.parse(stdout).results.map(i => i.name)

  if (tags.includes(packageVersion) || tags.includes('v' + packageVersion)) {
    console.error('Please update the package version before publishing.')
    return process.exit(1)
  }
})()
} catch (e) {
  console.log({ e })
}
