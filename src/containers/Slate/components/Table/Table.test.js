
import { mockReact } from '@/mocks/mockReact'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'
import { SLATE_ELEMENT_TYPE } from '../../models'
import { Table } from './Table'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/navigation')

const { ConnectedComponent, mapStateToProps } = Table

const refElement = document.createElement('div')
refElement.scrollIntoView = jest.fn()

describe('Container: Table', () => {
  describe('mapStateToProps', () => {
    it('should call uiSelector with state and pass the result as activeSourceId prop', () => {
      const { props } = mapStateToProps()
      expect(uiSelector).toHaveBeenCalled()
      expect(props.activeSourceId).toEqual(uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_SOURCE_ID])
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper, defaultProps

    beforeEach(() => {
      defaultProps = {
        children: <div />,
        element: {
          id: 'id',
          type: SLATE_ELEMENT_TYPE.TABLE,
        },
        attributes: {
          ref: {
            current: refElement,
          },
        },
        ...mapStateToProps().props,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should not call scrollIntoView in initial render', () => {
      expect(defaultProps.attributes.ref.current.scrollIntoView).not.toBeCalled()
    })

    it('should call scrollIntoView in case of table have to be highlighted', () => {
      defaultProps = {
        ...defaultProps,
        activeSourceId: 'id',
      }

      wrapper.setProps(defaultProps)
      expect(defaultProps.attributes.ref.current.scrollIntoView).toBeCalled()
    })
  })
})
