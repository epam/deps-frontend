
import { mockSessionStorageWrapper } from '@/mocks/mockSessionStorageWrapper'
import { renderHook, act } from '@testing-library/react-hooks'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'
import { useModalResize } from './useModalResize'

jest.mock('@/utils/sessionStorageWrapper', () => mockSessionStorageWrapper())

const mockInnerWidth = 1920
const mockInnerHeight = 1080

beforeEach(() => {
  window.innerWidth = mockInnerWidth
  window.innerHeight = mockInnerHeight
  sessionStorageWrapper.getItem.mockReturnValue(null)
  sessionStorageWrapper.setItem.mockClear()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('initial state', () => {
  test('returns default initial values', () => {
    const { result } = renderHook(() => useModalResize(false))

    expect(result.current.isResizing).toBe(false)
    expect(result.current.size).toEqual({
      width: 700,
      height: 500,
    })
    expect(result.current.position).toEqual({
      x: mockInnerWidth - 700 - 20,
      y: mockInnerHeight - 500 - 20,
    })
  })

  test('restores position from sessionStorage when storageKey is provided', () => {
    const storedState = {
      size: {
        width: 800,
        height: 600,
      },
      position: {
        x: 100,
        y: 200,
      },
    }
    sessionStorageWrapper.getItem.mockReturnValue(JSON.stringify(storedState))

    const { result } = renderHook(() => useModalResize(true, {
      storageKey: 'testModalState',
    }))

    expect(result.current.position).toEqual({
      x: 100,
      y: 200,
    })
    expect(result.current.size).toEqual({
      width: 800,
      height: 600,
    })
  })

  test('ignores sessionStorage when storageKey is not provided', () => {
    const storedState = {
      size: {
        width: 800,
        height: 600,
      },
      position: {
        x: 100,
        y: 200,
      },
    }
    sessionStorageWrapper.getItem.mockReturnValue(JSON.stringify(storedState))

    const { result } = renderHook(() => useModalResize(true))

    expect(result.current.position).toEqual({
      x: mockInnerWidth - 700 - 20,
      y: mockInnerHeight - 500 - 20,
    })
  })

  test('uses custom config values', () => {
    const customConfig = {
      initialWidth: 800,
      initialHeight: 600,
      margin: 30,
    }

    const { result } = renderHook(() => useModalResize(true, customConfig))

    expect(result.current.size).toEqual({
      width: 800,
      height: 600,
    })
    expect(result.current.position).toEqual({
      x: mockInnerWidth - 800 - 30,
      y: mockInnerHeight - 600 - 30,
    })
  })

  test('uses storageKey to save modal state to session storage', () => {
    const customConfig = {
      storageKey: 'customModalState',
    }

    const { result } = renderHook(() => useModalResize(true, customConfig))

    act(() => {
      result.current.updatePosition({
        x: 100,
        y: 200,
      })
    })

    expect(sessionStorageWrapper.setItem).toHaveBeenCalledWith(
      'customModalState',
      expect.any(String),
    )
  })
})

describe('visibility changes', () => {
  test('reloads state from sessionStorage when visibility changes to true', () => {
    sessionStorageWrapper.getItem.mockReturnValue(null)

    const { result, rerender } = renderHook(
      ({ isVisible }) => useModalResize(isVisible, { storageKey: 'testModalState' }),
      { initialProps: { isVisible: false } },
    )

    const initialPosition = {
      x: mockInnerWidth - 700 - 20,
      y: mockInnerHeight - 500 - 20,
    }
    expect(result.current.position).toEqual(initialPosition)

    const newStoredState = {
      size: {
        width: 800,
        height: 600,
      },
      position: {
        x: 150,
        y: 250,
      },
    }
    sessionStorageWrapper.getItem.mockReturnValue(JSON.stringify(newStoredState))

    rerender({ isVisible: true })

    expect(result.current.position).toEqual({
      x: 150,
      y: 250,
    })
    expect(result.current.size).toEqual({
      width: 800,
      height: 600,
    })
  })

  test('uses default position when sessionStorage has no stored state', () => {
    sessionStorageWrapper.getItem.mockReturnValue(null)

    const { result } = renderHook(() => useModalResize(true, {
      storageKey: 'testModalState',
    }))

    expect(result.current.position).toEqual({
      x: mockInnerWidth - 700 - 20,
      y: mockInnerHeight - 500 - 20,
    })
    expect(result.current.size).toEqual({
      width: 700,
      height: 500,
    })
  })

  test('uses default position when sessionStorage has partial state', () => {
    sessionStorageWrapper.getItem.mockReturnValue(JSON.stringify({
      size: {
        width: 800,
        height: 600,
      },
    }))

    const { result } = renderHook(() => useModalResize(true, {
      storageKey: 'testModalState',
    }))

    expect(result.current.position).toEqual({
      x: mockInnerWidth - 700 - 20,
      y: mockInnerHeight - 500 - 20,
    })
  })
})

describe('resize handlers', () => {
  test('handleResizeStart sets isResizing to true', () => {
    const { result } = renderHook(() => useModalResize(true))

    expect(result.current.isResizing).toBe(false)

    act(() => {
      result.current.resizableProps.onResizeStart()
    })

    expect(result.current.isResizing).toBe(true)
  })

  test('handleResizeStop sets isResizing to false and updates size', () => {
    const { result } = renderHook(() => useModalResize(true))

    const mockRef = {
      offsetWidth: 800,
      offsetHeight: 600,
    }

    act(() => {
      result.current.resizableProps.onResizeStart()
    })

    expect(result.current.isResizing).toBe(true)

    act(() => {
      result.current.resizableProps.onResizeStop(null, 'right', mockRef)
    })

    expect(result.current.isResizing).toBe(false)
    expect(result.current.size).toEqual({
      width: 800,
      height: 600,
    })
  })

  test('handleResize does nothing if resize not started', () => {
    const { result } = renderHook(() => useModalResize(true))

    const initialPosition = { ...result.current.position }
    const mockRef = { style: {} }

    act(() => {
      result.current.resizableProps.onResize(null, 'top', mockRef, {
        width: 0,
        height: 50,
      })
    })

    expect(result.current.position).toEqual(initialPosition)
  })

  describe('position adjustment during resize', () => {
    test('adjusts Y position when resizing from top', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'top', mockRef, {
          width: 0,
          height: 50,
        })
      })

      expect(result.current.position.x).toBe(initialPosition.x)
      expect(result.current.position.y).toBe(initialPosition.y - 50)
    })

    test('adjusts Y position when resizing from topLeft', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'topLeft', mockRef, {
          width: 30,
          height: 50,
        })
      })

      expect(result.current.position.x).toBe(initialPosition.x - 30)
      expect(result.current.position.y).toBe(initialPosition.y - 50)
    })

    test('adjusts Y position when resizing from topRight', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'topRight', mockRef, {
          width: 30,
          height: 50,
        })
      })

      expect(result.current.position.x).toBe(initialPosition.x)
      expect(result.current.position.y).toBe(initialPosition.y - 50)
    })

    test('adjusts X position when resizing from left', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'left', mockRef, {
          width: 40,
          height: 0,
        })
      })

      expect(result.current.position.x).toBe(initialPosition.x - 40)
      expect(result.current.position.y).toBe(initialPosition.y)
    })

    test('adjusts X position when resizing from bottomLeft', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'bottomLeft', mockRef, {
          width: 40,
          height: 50,
        })
      })

      expect(result.current.position.x).toBe(initialPosition.x - 40)
      expect(result.current.position.y).toBe(initialPosition.y)
    })

    test('keeps left edge fixed when resizing from right', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'right', mockRef, {
          width: 50,
          height: 0,
        })
      })

      expect(result.current.position).toEqual(initialPosition)
    })

    test('keeps top edge fixed when resizing from bottom', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'bottom', mockRef, {
          width: 0,
          height: 50,
        })
      })

      expect(result.current.position).toEqual(initialPosition)
    })

    test('keeps top-left corner fixed when resizing from bottomRight', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'bottomRight', mockRef, {
          width: 50,
          height: 50,
        })
      })

      expect(result.current.position).toEqual(initialPosition)
    })

    test('updates position state correctly', () => {
      const { result } = renderHook(() => useModalResize(true))

      const newPosition = {
        x: 100,
        y: 200,
      }

      act(() => {
        result.current.updatePosition(newPosition)
      })

      expect(result.current.position).toEqual(newPosition)
    })

    test('clamps Y position to minTopPosition when resizing from top beyond viewport', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'top', mockRef, {
          width: 0,
          height: initialPosition.y + 100,
        })
      })

      expect(result.current.position.y).toBe(0)
    })

    test('clamps X position to 0 when resizing from left beyond viewport', () => {
      const { result } = renderHook(() => useModalResize(true))

      const initialPosition = { ...result.current.position }
      const mockRef = { style: {} }

      act(() => {
        result.current.resizableProps.onResizeStart()
      })

      act(() => {
        result.current.resizableProps.onResize(null, 'left', mockRef, {
          width: initialPosition.x + 100,
          height: 0,
        })
      })

      expect(result.current.position.x).toBe(0)
    })
  })
})

describe('resizableProps', () => {
  test('contains all required properties', () => {
    const { result } = renderHook(() => useModalResize(true))

    expect(result.current.resizableProps).toEqual(
      expect.objectContaining({
        enable: {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        },
        maxHeight: '90vh',
        maxWidth: '90vw',
        minHeight: 500,
        minWidth: 450,
        size: {
          width: 700,
          height: 500,
        },
      }),
    )

    expect(typeof result.current.resizableProps.onResize).toBe('function')
    expect(typeof result.current.resizableProps.onResizeStart).toBe('function')
    expect(typeof result.current.resizableProps.onResizeStop).toBe('function')
  })

  test('uses custom min/max values from config', () => {
    const customConfig = {
      minWidth: 300,
      minHeight: 200,
      maxWidth: '80vw',
      maxHeight: '80vh',
    }

    const { result } = renderHook(() => useModalResize(true, customConfig))

    expect(result.current.resizableProps.minWidth).toBe(300)
    expect(result.current.resizableProps.minHeight).toBe(200)
    expect(result.current.resizableProps.maxWidth).toBe('80vw')
    expect(result.current.resizableProps.maxHeight).toBe('80vh')
  })
})
