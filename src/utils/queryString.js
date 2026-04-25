
import cloneDeep from 'lodash/cloneDeep'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import queryString from 'query-string'

const PARSE_OPTIONS = {
  decode: true,
  parseBooleans: true,
  parseNumbers: true,
  arrayFormat: 'bracket',
}

const checkIsInValid = (value) => (isObject(value) && isEmpty(value)) || value === undefined || value === null || value === ''

const removeInvalidValues = (obj) => {
  const result = cloneDeep(obj)

  for (const propName in result) {
    if (has(result, propName)) {
      if (checkIsInValid(result[propName])) {
        delete result[propName]
      }

      if (isObject(result[propName]) && !Array.isArray(result[propName])) {
        result[propName] = removeInvalidValues(result[propName])
      }
    }
  }
  return result
}

const searchParamsToQueryString = (searchParams) => {
  if (!searchParams) {
    return ''
  }
  const sp = removeInvalidValues(searchParams)
  const url = Object.entries(sp).reduce((acc, [key, value]) => {
    const invalidValue = checkIsInValid(value)
    if (isObject(value) && !invalidValue) {
      value = JSON.stringify(value)
    }
    return invalidValue ? acc : acc + `${key}=${encodeURIComponent(value)}&`
  }, '')

  return !url ? '' : `?${url.slice(0, -1)}`
}

const parseValue = (value) => {
  const invalidValues = ['', '[]', '{}', 'undefined', 'null']
  if (invalidValues.includes(value)) return null

  const boolValues = ['true', 'false']
  if (boolValues.includes(value)) return JSON.parse(value)

  if (!isNaN(value) && !isNaN(parseFloat(value))) return parseFloat(value)

  const arrayBrackets = ['[', ']']
  if (arrayBrackets.every((bracket) => value.includes(bracket))) return JSON.parse(value)

  const objectBrackets = ['{', '}']
  if (objectBrackets.every((bracket) => value.includes(bracket))) return JSON.parse(value)

  return value
}

const queryStringToSearchParams = (searchString) => {
  const parsedQueryString = queryString.parse(searchString, PARSE_OPTIONS)
  const searchParams = {}

  for (const [key, value] of Object.entries(parsedQueryString)) {
    const parsedValue = parseValue(value)
    if (parsedValue !== null) {
      searchParams[key] = parsedValue
    }
  }

  return searchParams
}

const getQueryString = (object) => {
  let queryString = ''

  if (!object) {
    return queryString
  }

  const validParams = removeInvalidValues(object)

  for (const key in validParams) {
    if (Array.isArray(object[key])) {
      for (let i = 0; i < object[key].length; i++) {
        queryString += `&${key}=${object[key][i]}`
      }
    } else {
      queryString += `&${key}=${object[key]}`
    }
  }
  return `?${queryString.slice(1)}`
}

const queryStringify = (params) => queryString.stringify(
  params,
  {
    skipEmptyString: true,
    skipNull: true,
  },
)

export {
  getQueryString,
  queryStringify,
  queryStringToSearchParams,
  searchParamsToQueryString,
}
