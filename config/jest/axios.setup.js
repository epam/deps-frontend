
module.exports = {
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      request: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      formPost: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      },
      defaults: {
        baseURL: '',
        timeout: 30000,
        headers: {}
      }
    })),
    CancelToken: {
      source: jest.fn(() => ({
        token: 'mock-token',
        cancel: jest.fn()
      }))
    },
    isCancel: jest.fn(),
    Cancel: jest.fn()
  }
}
