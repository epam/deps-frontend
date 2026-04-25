
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { TextAreaField } from '@/containers/DocumentField'
import { ValueField } from '.'

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: jest.fn(() => ({
    ExpandableContainer: ({ children }) => <div>{children}</div>,
    ToggleExpandIcon: () => 'mockIcon',
  })),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: ValueField', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      value: 'mockValue',
      updateField: jest.fn(),
    }

    wrapper = shallow(<ValueField {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call updateField when calling to onChange method', () => {
    wrapper.find(TextAreaField).props().onChange()

    expect(defaultProps.updateField).toHaveBeenCalledTimes(1)
  })
})
