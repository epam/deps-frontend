
import {
  buildDateSelector,
  commitHashSelector,
  tableColumnsSelector,
  systemBuildSelector,
} from './system'

describe('Selectors: system', () => {
  let state

  beforeEach(() => {
    state = {
      system: {
        tableColumns: null,
      },
    }
  })

  it('selector: systemBuildSelector', () => {
    expect(systemBuildSelector(state)).toStrictEqual(state.system)
  })

  it('selector: tableColumnsSelector', () => {
    expect(tableColumnsSelector(state)).toBe(state.system.tableColumns)
  })

  it('selector: buildDateSelector in case of not exists buildDate prop', () => {
    expect(buildDateSelector(state)).toBe('')
  })

  it('selector: buildDateSelector', () => {
    state.system = {
      ...state.system,
      buildDate: 'mockDate',
    }
    expect(buildDateSelector(state)).toBe(state.system.buildDate)
  })

  it('selector: commitHashSelector in case of not exists commitHash prop', () => {
    expect(commitHashSelector(state)).toBe('')
  })

  it('selector: buildDateSelector', () => {
    state.system = {
      ...state.system,
      commitHash: 'mockHash',
    }
    expect(commitHashSelector(state)).toBe(state.system.commitHash)
  })
})
