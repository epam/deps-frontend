
import { createElement } from './document'

describe('Utils: document', () => {
  let originalCreateElement

  beforeAll(() => {
    originalCreateElement = document.createElement
    document.createElement = jest.fn((tag) => {
      const element = {}
      element.tag = tag
      element.classList = {}
      element.classList.classes = []
      element.classList.add = jest.fn((name) => {
        element.classList.classes.push(name)
      })

      return element
    })
  })

  afterAll(() => {
    document.createElement = originalCreateElement
  })

  it('should create element with class name', () => {
    const mockTag = 'mockTag'
    const mockClass = 'mockClass'

    const element = createElement(mockTag, mockClass)

    expect(element.tag).toEqual(mockTag)
    expect(element.classList.classes.includes(mockClass)).toEqual(true)
  })
})
