
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import React from 'react'
import { Cell } from '@/models/ExtractedData'
import { ENV } from '@/utils/env'
import { UnifiedDataHandsonTable } from './UnifiedDataHandsonTable'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/hocs/withParentSize', () => ({
  withParentSize: () => (Component) => Component,
}))
jest.mock('react', () => mockReact())

const cells = [
  new Cell(0, 0, '0 1', 2, 2),
]

const MAX_CONTENT_LENGTH = 12

describe('Container: UnifiedDataHandsonTable', () => {
  let defaultProps, wrapper

  beforeEach(() => {
    defaultProps = {
      unifiedData: {
        cells,
      },
      highlightedField: null,
    }

    wrapper = shallow(<UnifiedDataHandsonTable {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should collapse cell value if FEATURE_COLLAPSIBLE_SELECTED_CELLS is enabled', () => {
    ENV.FEATURE_COLLAPSIBLE_SELECTED_CELLS = true
    const longCellValue = 'loooongCeeeeeellVaaaaaalue'
    const collapsedCellValue = `${longCellValue.slice(0, MAX_CONTENT_LENGTH)}...`

    defaultProps.unifiedData.cells = [new Cell(0, 0, longCellValue, 2, 2)]

    wrapper.setProps(defaultProps)
    const wrapperCell = wrapper.props().data[0][0]

    expect(wrapperCell).toEqual(collapsedCellValue)
    ENV.FEATURE_COLLAPSIBLE_SELECTED_CELLS = false
  })

  it('should not collapse cell value if FEATURE_COLLAPSIBLE_SELECTED_CELLS is disabled', () => {
    const longCellValue = 'loooongCeeeeeellVaaaaaalue'

    defaultProps.unifiedData.cells = [new Cell(0, 0, longCellValue, 2, 2)]

    wrapper.setProps(defaultProps)
    const wrapperCell = wrapper.props().data[0][0]

    expect(wrapperCell).toEqual(longCellValue)
  })

  it('should extend collapsed cell, if highlighted', () => {
    React.useState = jest.fn()
      .mockReturnValueOnce([[[0, 0]], jest.fn()])

    const longCellValue = 'loooongCeeeeeellVaaaaaalue'

    defaultProps.unifiedData.cells = [new Cell(0, 0, longCellValue, 2, 2)]
    defaultProps.highlightedField = [[0, 0]]

    wrapper.setProps(defaultProps)

    const wrapperCell = wrapper.props().data[0][0]
    expect(wrapperCell).toEqual(longCellValue)
  })
})
