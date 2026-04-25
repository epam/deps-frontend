
import { AlphaNumericValidator, MaxValidator, RequiredValidator, UniqueSymbolValidator, WhitespaceValidator } from './Validators'

describe('Component: Validators', () => {
  it('should return expected class MaxValidator structure', () => {
    const testClass = new MaxValidator(55, 'mockMessage')
    const testClass2 = new MaxValidator()

    expect(testClass).toEqual({
      max: 55,
      message: 'mockMessage',
    })

    expect(testClass2).toEqual({
      max: 128,
      message: 'The value should be no longer than 128 characters.',
    })
  })

  it('should return expected class RequiredValidator structure', () => {
    const testClass = new RequiredValidator('mockMessage')
    const testClass2 = new RequiredValidator()

    expect(testClass).toEqual({
      message: 'mockMessage',
      required: true,
    })

    expect(testClass2).toEqual({
      message: 'The value is required.',
      required: true,
    })
  })

  it('should return expected class AlphaNumericValidator structure', () => {
    const testClass = new AlphaNumericValidator('mockMessage')
    const testClass2 = new AlphaNumericValidator()

    expect(testClass).toEqual({
      message: 'mockMessage',
      pattern: new RegExp(/^[a-z0-9-_]+$/, 'i'),
    })

    expect(testClass2).toEqual({
      message: 'Only latin characters, numbers and "_", "-" symbols are allowed.',
      pattern: new RegExp(/^[a-z0-9-_]+$/, 'i'),
    })
  })

  it('should return expected class WhitespaceValidator structure', () => {
    const testClass = new WhitespaceValidator('mockMessage')
    const testClass2 = new WhitespaceValidator()

    expect(testClass).toEqual({
      message: 'mockMessage',
      whitespace: true,
    })

    expect(testClass2).toEqual({
      message: 'The value should not be empty.',
      whitespace: true,
    })
  })

  it('should return expected class UniqueSymbolValidator structure', () => {
    const testClass = new UniqueSymbolValidator('mockMessage')
    const testClass2 = new UniqueSymbolValidator()

    expect(testClass).toEqual({
      message: 'mockMessage',
      validator: expect.any(Function),
    })

    expect(testClass2).toEqual({
      message: 'Characters in this field should be unique.',
      validator: expect.any(Function),
    })
  })

  it('should call to done without any args if a value is not provided', () => {
    const testClass = new UniqueSymbolValidator('mockMessage')
    const mockDone = jest.fn()

    testClass.validator(null, undefined, mockDone)
    testClass.validator(null, [], mockDone)

    expect(mockDone).nthCalledWith(1)
    expect(mockDone).nthCalledWith(2)
  })

  it('should call to done without any args if value only contains unique chars', () => {
    const testClass = new UniqueSymbolValidator('mockMessage')
    const mockDone = jest.fn()

    testClass.validator(null, 'abcde', mockDone)

    expect(mockDone).nthCalledWith(1)
  })

  it('should call to done with correct arg if value only contains repeated chars', () => {
    const testClass = new UniqueSymbolValidator('mockMessage')
    const mockDone = jest.fn()

    testClass.validator(null, 'aabcde', mockDone)

    expect(mockDone).nthCalledWith(1, 'mockMessage')
  })
})
