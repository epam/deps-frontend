
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Localization, localize } from '@/localization/i18n'
import { ExpandButton } from './ExpandButton'
import { Button } from './ExpandButton.styles'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ExpandButton', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      toggleView: jest.fn(),
      isCollapsed: false,
      documentsCount: 5,
    }

    wrapper = shallow(<ExpandButton {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct button content if props.isCollapsed is equal to true', () => {
    defaultProps.isCollapsed = true

    wrapper.setProps(defaultProps)

    expect(
      wrapper.text(),
    ).toEqual(
      localize(Localization.SHOW_ALL, { count: defaultProps.documentsCount }),
    )
  })

  it('should render correct button content if props.isCollapsed is equal to false', () => {
    defaultProps.isCollapsed = false

    wrapper.setProps(defaultProps)

    expect(
      wrapper.text(),
    ).toEqual(
      localize(Localization.COLLAPSE),
    )
  })

  it('should call to props.toggleView when clicking on button', () => {
    const ButtonComponent = wrapper.find(Button)
    ButtonComponent.props().onClick()

    expect(defaultProps.toggleView).nthCalledWith(1)
  })
})
