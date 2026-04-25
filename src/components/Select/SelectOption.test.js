
import {
  noneOption,
  anyOption,
  enumToOptions,
  keyValueToOptions,
  stringsToOptions,
} from '@/components/Select'

describe('Model: SelectOption', () => {
  describe('noneOption', () => {
    it('should has expected text and value', () => {
      expect(noneOption.value).toEqual('None')
      expect(noneOption.text).toEqual('none')
    })
  })

  describe('anyOption', () => {
    it('should has expected text and value', () => {
      expect(anyOption.value).toEqual('Any')
      expect(anyOption.text).toEqual('any')
    })
  })

  describe('enumToOptions', () => {
    it('should map enum to options correctly', () => {
      const MockEnum = {
        PROPA: 'PropA',
        PROPB: 'PropB',
      }

      expect(enumToOptions(MockEnum)).toEqual([{
        value: MockEnum.PROPA,
        text: MockEnum.PROPA,
      }, {
        value: MockEnum.PROPB,
        text: MockEnum.PROPB,
      }])
    })
  })

  describe('keyValueToOptions', () => {
    it('should map key-value object to options correctly', () => {
      const obj = {
        KeyA: 'ValueA',
        KeyB: 'ValueB',
      }

      expect(keyValueToOptions(obj)).toEqual([{
        value: 'KeyA',
        text: 'ValueA',
      }, {
        value: 'KeyB',
        text: 'ValueB',
      }])
    })
  })

  describe('stringsToOptions', () => {
    it('should map array of strings to options correctly', () => {
      const array = ['a', 'b']
      const mapper = { a: 'A' }

      expect(stringsToOptions(array, mapper)).toEqual([{
        value: 'a',
        text: 'A',
      }, {
        value: 'b',
        text: 'b',
      }])
    })
  })
})
