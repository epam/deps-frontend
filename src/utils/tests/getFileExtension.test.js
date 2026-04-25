
import { getFileExtension } from '@/utils/getFileExtension'

test('returns correct extension for passed argument', () => {
  const url = 'test.PDF'
  const result = getFileExtension(url)

  expect(result).toEqual('.pdf')
})

test('returns correct extension for passed argument if argument contains several extensions', () => {
  const url = 'test.png.pdf'
  const result = getFileExtension(url)

  expect(result).toEqual('.pdf')
})

test('returns empty extension if passed argument does not have extension', () => {
  const url = 'test'
  const result = getFileExtension(url)

  expect(result).toEqual('')
})
