
const mockReactSizeMe = (mockProps) => ({
  __esModule: true,
  default: () => (Component) => (props) => (
    <Component
      {...mockProps}
      {...props}
    />
  ),
})

export {
  mockReactSizeMe,
}
