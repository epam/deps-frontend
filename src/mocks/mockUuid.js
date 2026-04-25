
const mockUuid = {
  v4: ((n = 1) => jest.fn(() => `${n++}`))(),
}

export {
  mockUuid,
}
