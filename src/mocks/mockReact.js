
const mockReact = ({
  mockUseCallback,
  mockUseEffect,
  mockUseState,
  mockCreateRef,
  mockUseRef,
} = {}) => ({
  ...jest.requireActual('react'),
  useCallback: mockUseCallback || jest.fn((fn) => fn),
  useEffect: jest.fn((f) => mockUseEffect ? mockUseEffect(f) : f()),
  useState: mockUseState || jest.fn((state) => {
    if (typeof state === 'function') {
      state = state()
    }

    const setState = jest.fn((changes) => {
      state = changes
    })
    return [state, setState]
  }),
  createRef: mockCreateRef ? jest.fn(mockCreateRef) : jest.fn(() => ({ current: null })),
  useRef: mockUseRef ? jest.fn(mockUseRef) : jest.fn(() => ({ current: null })),
})

export {
  mockReact,
}
