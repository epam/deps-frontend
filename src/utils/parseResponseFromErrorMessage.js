
import { jsonTryParse } from './jsonTryParse'

const ERROR_TEMPLATE = /(?<statusText>.*) (?<status>\(.*\): )(?<responseJson>.*)/

export const parseResponseFromErrorMessage = (message) => {
  if (!ERROR_TEMPLATE.test(message)) {
    return null
  }
  const { groups } = message.match(ERROR_TEMPLATE)
  return jsonTryParse(groups.responseJson)
}
