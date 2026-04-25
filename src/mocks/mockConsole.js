
const mockConsole = () => {
  const consoleWarn = console.warn
  const consoleError = console.error
  console.warn = jest.fn()
  console.error = jest.fn()
  return () => {
    console.warn = consoleWarn
    console.error = consoleError
  }
}

export {
  mockConsole,
}
