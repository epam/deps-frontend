
import { parseResponseFromErrorMessage } from '../parseResponseFromErrorMessage'

describe('Utils: parseResponseFromErrorMessage', () => {
  it('should return empty value if error message does not match template', () => {
    expect(parseResponseFromErrorMessage('Status Text')).toBeNull()
  })

  it('should return empty value if error message does not have response in json format', () => {
    expect(parseResponseFromErrorMessage('Status Text (404): Description')).toBeNull()
  })

  it('should return response from error message', () => {
    const response = {
      code: 503,
      description: 'Description',
    }
    expect(parseResponseFromErrorMessage(`Status Text (503): ${JSON.stringify(response)}`)).toEqual(response)
  })
})
