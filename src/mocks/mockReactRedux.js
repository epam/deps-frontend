
const createMockMapStateToProps = (mapStateToProps) => {
  if (!mapStateToProps) {
    return mapStateToProps
  }

  return (state, ownProps) => {
    return {
      props: mapStateToProps(state, ownProps),
    }
  }
}

const getDispatchFunctionFormShorthandObject = (actionsObj) => (dispatch) => {
  return Object.keys(actionsObj).reduce((props, actionKey) => {
    return {
      ...props,
      [actionKey]: function () {
        return dispatch(actionsObj[actionKey].apply(this, arguments))
      },
    }
  }, {})
}

const createMockMapDispatchToProps = (mapDispatchToProps) => {
  if (!mapDispatchToProps) {
    return mapDispatchToProps
  }

  const mappingFunction = typeof mapDispatchToProps === 'function'
    ? mapDispatchToProps
    : getDispatchFunctionFormShorthandObject(mapDispatchToProps)

  return (dispatch, ownProps) => {
    dispatch = dispatch || jest.fn((action) => action)

    return {
      props: mappingFunction(dispatch, ownProps),
      dispatch,
    }
  }
}

const createMockMergeProps = (mergeProps) => {
  if (!mergeProps) {
    return mergeProps
  }

  return (stateProps, dispatchProps, ownProps) => {
    dispatchProps = dispatchProps || { dispatch: jest.fn((action) => action) }

    return {
      props: mergeProps(stateProps, dispatchProps, ownProps),
      dispatch: dispatchProps.dispatch,
    }
  }
}

const mockReactRedux = {
  connect: (mapStateToProps, mapDispatchToProps, mergeProps) => (ConnectedComponent) => ({
    mapStateToProps: createMockMapStateToProps(mapStateToProps),
    mapDispatchToProps: createMockMapDispatchToProps(mapDispatchToProps),
    mergeProps: createMockMergeProps(mergeProps),
    ConnectedComponent,
  }),
  batch: jest.fn((fn) => fn()),
  useSelector: jest.fn((selector) => selector()),
  useDispatch: jest.fn(() => jest.fn((action) => action)),
  Provider: ({ children }) => children,
}

export {
  mockReactRedux,
}
