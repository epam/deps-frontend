
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import React from 'react'
import { SearchInput } from '@/containers/SearchInput'
import { FrequentlyAskedQuestions } from './FrequentlyAskedQuestions'
import { Collapse } from './FrequentlyAskedQuestions.styles'

const mockSetState = jest.fn()

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest
    .fn((f) => [f, mockSetState])
    .mockImplementationOnce(() => ['', jest.fn])
    .mockImplementationOnce(() => ['Complicated string', jest.fn]),
  useCallback: jest.fn((f) => f),
  useMemo: jest.fn((f) => f()),
}))

jest.mock('@/utils/env', () => mockEnv)

describe('Component: FrequentlyAskedQuestions', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FrequentlyAskedQuestions />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render the correct layout if there are no components matching filter', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call useState when onChange prop in SearchInput called', () => {
    wrapper.find(SearchInput).props().onChange()
    expect(mockSetState).toHaveBeenCalledTimes(1)
  })

  it('should render expandIcon with 180 degrees if isActive true', () => {
    const expandIcon = wrapper.find(Collapse).at(0).props().expandIcon({ isActive: true })
    const renderedIcon = shallow(<div>{expandIcon}</div>)
    expect(renderedIcon).toMatchSnapshot()
  })

  it('should render expandIcon with 0 degrees if isActive false', () => {
    const expandIcon = wrapper.find(Collapse).at(0).props().expandIcon({ isActive: false })
    const renderedIcon = shallow(<div>{expandIcon}</div>)
    expect(renderedIcon).toMatchSnapshot()
  })
})
