
const IGNORABLE_WARNINGS = [
  '[antd: Menu] `children` will be removed',
  'Can\'t perform a React state update on an unmounted component'
]

/**
 * Temporary suppression of Antd deprecation warnings during migration to 4.24.0
 * These deprecated APIs must be replaced - tracked in #29891
 */
const normalizeWarningText = (value) => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value.message === 'string') {
    return value.message
  }

  return String(value)
}

const isIgnorableAntdWarning = (message) => {
  if (!message) {
    return false
  }

  const text = normalizeWarningText(message)
  return IGNORABLE_WARNINGS.some((pattern) => text.includes(pattern))
}

const consoleError = console.error
console.error = function (message) {
  if (isIgnorableAntdWarning(message)) {
    return
  }

  if (
    message.name &&
    message.name.startsWith &&
    message.name.startsWith('mock')
  ) {
    return
  }

  consoleError.apply(console, arguments)
  throw typeof message === 'string' ? new Error(message) : message
}

const consoleWarn = console.warn
console.warn = function (message) {
  if (isIgnorableAntdWarning(message)) {
    return
  }

  consoleWarn.apply(console, arguments)
  throw (typeof message === 'string') ? new Error(message) : message
}
