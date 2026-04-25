
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { TextAreaField } from '@/containers/DocumentField'
import { KeyField } from './'

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: jest.fn(() => ({
    ExpandableContainer: ({ children }) => <div>{children}</div>,
    ToggleExpandIcon: () => 'mockIcon',
  })),
}))

jest.mock('@/utils/env', () => mockEnv)

describe('Component: KeyField', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      value: 'mockValue',
      updateField: jest.fn(),
    }

    wrapper = shallow(<KeyField {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onChange prop when Key Field was changed', () => {
    wrapper.find(TextAreaField).props().onChange()

    expect(defaultProps.updateField).toHaveBeenCalledTimes(1)
  })
})
