
const mockSessionStorageWrapper = (mockData) => ({
  sessionStorageWrapper: {
    getItem: jest.fn(() => {
      if (typeof mockData === 'string') {
        return mockData
      }
      return JSON.stringify(mockData)
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
})

export {
  mockSessionStorageWrapper,
}
