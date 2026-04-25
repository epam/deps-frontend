
import { openInNewTarget, outerHeight } from './window'

const mockPath = 'mockUrl'
const mockCallback = jest.fn()

describe('Utils: window', () => {
  describe('Utility: outerHeight', () => {
    let getComputedStyle

    beforeAll(() => {
      getComputedStyle = window.getComputedStyle

      window.getComputedStyle = jest.fn(() => ({
        getPropertyValue: jest.fn(() => 10),
      }))
    })

    afterAll(() => {
      window.getComputedStyle = getComputedStyle
    })

    it('should get element outer height', () => {
      const mockElement = {
        offsetHeight: 10,
      }

      const height = outerHeight(mockElement)

      expect(window.getComputedStyle).toHaveBeenCalledWith(mockElement)
      expect(height).toEqual(30)
    })
  })

  describe('Utility: openInNewTarget', () => {
    let event

    beforeEach(() => {
      window.open = jest.fn()

      event = {
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
      }
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call callback if just left mouse button is pressed', () => {
      openInNewTarget(event, mockPath, mockCallback)

      expect(mockCallback).toHaveBeenCalled()
    })

    it('should call window.open in new tab if crtl+left mouse buttons are pressed', () => {
      event.ctrlKey = true

      openInNewTarget(event, mockPath, mockCallback)

      expect(window.open).nthCalledWith(1, mockPath)
    })

    it('should call window.open in new tab if shift+left mouse buttons are pressed', () => {
      event.shiftKey = true

      openInNewTarget(event, mockPath, mockCallback)

      expect(window.open).nthCalledWith(1, mockPath, '_blank')
    })

    it('should call window.open in new tab if cmd+left mouse buttons are pressed', () => {
      event.metaKey = true

      openInNewTarget(event, mockPath, mockCallback)

      expect(window.open).nthCalledWith(1, mockPath)
    })
  })
})
