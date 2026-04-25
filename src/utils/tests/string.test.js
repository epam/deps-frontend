
import {
  getUrlWithOrigin,
  maskExcessChars,
} from '@/utils/string'

describe('maskExcessChars', () => {
  it('should returns the original value if charLimit is greater than value length', () => {
    const result = maskExcessChars(5, 'abc')
    expect(result).toBe('abc')
  })

  it('should masks the excess characters with the provided mask', () => {
    const result = maskExcessChars(4, 'abcdef', '#')
    expect(result).toBe('abcd##')
  })

  it('should masks the excess characters with * by default', () => {
    const result = maskExcessChars(3, 'abcdef')
    expect(result).toBe('abc***')
  })

  it('should returns an empty string if no value is provided', () => {
    const result = maskExcessChars(3, '')
    expect(result).toBe('')
  })
})

describe('getUrlWithOrigin', () => {
  const originalLocation = window.location

  beforeEach(() => {
    delete window.location
    window.location = {
      origin: 'https://example.com',
    }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  test('returns absolute URL as is', () => {
    const url = 'https://api.example.com/v1/users'
    expect(getUrlWithOrigin(url)).toBe(url)
  })

  test('returns absolute URL with http as is', () => {
    const url = 'http://api.example.com/v1/users'
    expect(getUrlWithOrigin(url)).toBe(url)
  })

  test('adds origin to URL starting with slash', () => {
    const url = '/api/v1/users'
    expect(getUrlWithOrigin(url)).toBe('https://example.com/api/v1/users')
  })

  test('adds origin and slash to URL without leading slash', () => {
    const url = 'api/v1/users'
    expect(getUrlWithOrigin(url)).toBe('https://example.com/api/v1/users')
  })
})
