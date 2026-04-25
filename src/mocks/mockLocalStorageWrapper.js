
const mockLocalStorageWrapper = (mockData) => ({
  localStorageWrapper: {
    getItem: jest.fn(() => {
      if (typeof mockData === 'string') {
        return mockData
      }
      return mockData
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
})

export {
  mockLocalStorageWrapper,
}
