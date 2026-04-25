
const mockSelector = (returnValue) => {
  const mockFunction = jest.fn(() => returnValue)
  mockFunction.getSelectorMockValue = () => mockFunction.getMockImplementation()()

  return mockFunction
}

export {
  mockSelector,
}
