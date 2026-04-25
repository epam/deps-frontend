
import { ConnectedRouter } from 'connected-react-router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Provider as StoreProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { store } from '@/application/Provider/contexts/store'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { theme } from '@/theme/theme.default'
import { history } from '@/utils/history'
import { childrenShape } from '@/utils/propTypes'
import { LanguageProvider } from './LanguageProvider'

const Provider = (props) => (
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <StoreProvider store={store}>
        <ConnectedRouter history={history}>
          <DndProvider backend={HTML5Backend}>
            <LanguageProvider>
              {props.children}
            </LanguageProvider>
          </DndProvider>
        </ConnectedRouter>
      </StoreProvider>
    </ThemeProvider>
  </ErrorBoundary>
)

Provider.propTypes = {
  children: childrenShape.isRequired,
}

export {
  Provider,
}
