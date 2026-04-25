import { render } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Provider as StoreProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { store } from '@/application/Provider/contexts/store'
import { theme } from '@/theme/theme.default'
import { childrenShape } from '@/utils/propTypes'

const AllTheProviders = ({ children }) => (
  <ThemeProvider theme={theme}>
    <StoreProvider store={store}>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </StoreProvider>
  </ThemeProvider>
)

AllTheProviders.propTypes = {
  children: childrenShape,
}

const customRender = (component, options) =>
  render(component, {
    wrapper: AllTheProviders,
    ...options,
  })

export { customRender as render }
