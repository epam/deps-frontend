
const mockErrorName = 'mockError'
const mockErrorMessage = 'mockErrorMessage'

class MockError extends Error {
  constructor (name, message) {
    super(message || mockErrorMessage)
    this.name = name || mockErrorName
  }
}

export {
  mockErrorName,
  mockErrorMessage,
  MockError,
}
