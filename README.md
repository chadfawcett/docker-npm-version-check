[![Build Status](https://semaphoreci.com/api/v1/chadfawcett/docker-npm-version-check/branches/master/badge.svg)](https://semaphoreci.com/chadfawcett/docker-npm-version-check)

# docker-npm-version-check
Verifies package version has been updated for new release

## Usage

If I am in the repository for the `chadfawcett/test-image` docker image, and I
want to test to make sure I have updated the npm version in `package.json`
before building and tagging a new image release, I can run the following
command.

```bash
npx docker-npm-version-check chadfawcett/test-image
```

The script will get the current npm version from `package.json` as well as the
latest tag that has been published to Docker Hub. If the latest Docker image
tag is equal to or greater than the `package.json` version, the script will
exit with a status code of 1. We now know the version needs to be bumped before
building and deploying the new image in order to avoid overriding existing
images.

This can be useful as a command in your CI. You create a Pull Request, and your
CI runs the tests in which one is to run the above command. If you have
not bumped the npm version in your PR, then your tests will fail preventing you
from merging.
