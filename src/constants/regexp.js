
const ONLY_ALPHA_NUMERIC = new RegExp(/^[a-z0-9-_]+$/, 'i')
const ONLY_INTEGERS = new RegExp(/^\d+$/)
const FORBIDDEN_WHITE_SPACE_BEFORE_TEXT = new RegExp(/^(?!\s*$).+/)
const FORBIDDEN_SPECIAL_SYMBOLS = new RegExp(/[^a-z0-9_]/, 'ig')
const EMAIL_TEMPLATE = '[a-z0-9_-]+(?:\\.[a-z0-9_-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])'
const EMAIL_LIST_REGEXP = new RegExp(`${EMAIL_TEMPLATE}`, 'ig')
const EMAIL_REGEXP = new RegExp(`^${EMAIL_TEMPLATE}$`, 'i')

export {
  ONLY_ALPHA_NUMERIC,
  FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
  FORBIDDEN_SPECIAL_SYMBOLS,
  ONLY_INTEGERS,
  EMAIL_REGEXP,
  EMAIL_LIST_REGEXP,
}
