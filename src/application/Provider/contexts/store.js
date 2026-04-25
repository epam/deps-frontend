
import { configureStore } from '@reduxjs/toolkit'
import { routerMiddleware } from 'connected-react-router'
import { rootApi } from '@/apiRTK/rootApi'
import { createReducers } from '@/reducers'
import { history } from '@/utils/history'

const store = configureStore({
  reducer: createReducers(history),
  middleware: (getDefaultMiddleware) =>

    // TODO #9612
    getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: ['navigation'],
      },
      serializableCheck: false,
    })
      .concat(
        rootApi.middleware,
        routerMiddleware(history),
      ),
})

export {
  store,
}
