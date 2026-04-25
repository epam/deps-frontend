
import {
  prototypePageSelector,
  keyToAssignSelector,
  activeLayoutIdSelector,
  activeTableSelector,
  showTableDrawerSelector,
} from './prototypePage'

describe('Selectors: prototypePage', () => {
  const state = {
    prototypePage: {
      keyToAssign: 'mockKey',
      activeTable: ['mockTable'],
      showTableDrawer: false,
    },
  }

  it('selector: prototypePageSelector', () => {
    expect(prototypePageSelector(state)).toEqual(state.prototypePage)
  })

  it('selector: keyToAssignSelector', () => {
    expect(keyToAssignSelector(state)).toEqual(state.prototypePage.keyToAssign)
  })

  it('selector: activeLayoutIdSelector', () => {
    expect(activeLayoutIdSelector(state)).toEqual(state.prototypePage.activeLayoutId)
  })

  it('selector: activeTableSelector', () => {
    expect(activeTableSelector(state)).toEqual(state.prototypePage.activeTable)
  })

  it('selector: showTableDrawerSelector', () => {
    expect(showTableDrawerSelector(state)).toEqual(state.prototypePage.showTableDrawer)
  })
})
