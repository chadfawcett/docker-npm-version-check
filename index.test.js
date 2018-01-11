beforeEach(() => {
  jest.resetModules()
  jest.mock('./package.json', () => ({ version: '0.0.0' }))
  delete global.process.argv[2]
})

test('exit with status code 1 if no package.json version can be found', () => {
  const exitMock = global.process.exit = jest.fn()
  const consoleErrorMock = global.console.error = jest.fn()
  jest.mock('./package.json', function() { throw new Error() })
  require('./index')  // script is automatically execute when required

  expect(exitMock.mock.calls.length).toBe(1)
  expect(exitMock.mock.calls[0][0]).toBe(1)
  expect(consoleErrorMock.mock.calls.length).toBe(1)
  expect(consoleErrorMock.mock.calls[0][0])
    .toBe('Could not find package.json version')
})

test('exit with status code 1 if no repository is specified', () => {
  const exitMock = global.process.exit = jest.fn()
  const consoleErrorMock = global.console.error = jest.fn()
  require('./index')  // script is automatically execute when required

  expect(exitMock.mock.calls.length).toBe(1)
  expect(exitMock.mock.calls[0][0]).toBe(1)
  expect(consoleErrorMock.mock.calls.length).toBe(1)
  expect(consoleErrorMock.mock.calls[0][0])
    .toBe('Please provide a docker repository')
})

test.only('exit with status code 1 if package needs to be updated', () => {
  const repo = global.process.argv[2] = 'fake/docker-repo'

  const mockStdout = { stdout: '{ "results": [ { "name": "latest" }, { "name": "0.0.0" } ] }' }

  const exitMock = global.process.exit = jest.fn()
  const consoleErrorMock = global.console.error = jest.fn()
  const mockExec = jest.fn(() => mockStdout)
  jest.mock('child_process', () => ({
    exec: mockExec
  }))
  require('./index')  // script is automatically execute when required

  expect(exitMock.mock.calls.length).toBe(1)
  expect(exitMock.mock.calls[0][0]).toBe(1)
  expect(consoleErrorMock.mock.calls.length).toBe(1)
  expect(consoleErrorMock.mock.calls[0][0])
    .toBe('Please update the package version before publishing.')
  //expect(execMock.mock.calls.length).toBe(1)
  //expect(execMock.mock.calles[0][0])
    //.toBe(`curl 'https://registry.hub.docker.com/v2/repositories/${repo}/tags/'`)
})

test.skip('should error if docker repo does not exist', () => {})

test.skip('exit without error if package does not need to be updated', () => {})

// The initial implementation got the latest ten tags from docker hub. This
// would allow for a really old tag to be re-published if there were at least
// 10 newer tags than the one attempting to be built.
test.skip('should not allow super old tag', () => {})
