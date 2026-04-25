
import { truncateToWordBoundary } from './truncateToWordBoundary'

test('returns text unchanged if shorter than max length', () => {
  const shortText = 'Short prompt'
  const maxLength = 20
  expect(truncateToWordBoundary(shortText, maxLength)).toBe(shortText)
})

test('returns text unchanged if equal to max length', () => {
  const maxLength = 20
  const exactText = 'a'.repeat(maxLength)
  expect(truncateToWordBoundary(exactText, maxLength)).toBe(exactText)
})

test('truncates text at word boundary when text exceeds max length', () => {
  const text = 'This is a test sentence'
  const result = truncateToWordBoundary(text, 10)

  expect(result.length).toBeLessThanOrEqual(10)
  expect(result).toBe('This is a')
})

test('handles empty string', () => {
  expect(truncateToWordBoundary('')).toBe('')
})

test('uses default maxLength of 100 when not specified', () => {
  const longText = 'a'.repeat(150)
  const result = truncateToWordBoundary(longText)

  expect(result.length).toBe(100)
  expect(result).toBe('a'.repeat(100))
})

test('handles text with multiple consecutive spaces', () => {
  const text = 'Hello    world    this    is    a    test    sentence'
  const result = truncateToWordBoundary(text, 20)

  expect(result.length).toBeLessThanOrEqual(20)
  expect(result).toBe('Hello    world')
})

test('handles text with leading spaces', () => {
  const text = '   Hello world this is a test'
  const result = truncateToWordBoundary(text, 15)

  expect(result.length).toBeLessThanOrEqual(15)
  expect(result).toBe('Hello world')
})

test('handles text with trailing spaces', () => {
  const text = 'Hello world    '
  const result = truncateToWordBoundary(text, 20)

  expect(result).toBe('Hello world')
})

test('handles very long word with spaces before', () => {
  const text = 'Hello Supercalifragilisticexpialidocious world'
  const result = truncateToWordBoundary(text, 20)

  expect(result.length).toBeLessThanOrEqual(20)
  expect(result).toBe('Hello')
})
