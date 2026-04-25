
import { ButtonType } from '@/components/Button'
import { TagIcon } from '@/components/Icons/TagIcon'
import { shallowWithTheme } from '@/utils/shallowWithTheme'
import { Button } from '.'

describe('Component: Button', () => {
  it('should render correct Button layout according to props', () => {
    const wrapper = shallowWithTheme(<Button>MockChild</Button>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct IconButton layout according to props', () => {
    const wrapper = shallowWithTheme(<Button.Icon icon={<TagIcon />} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct GradientButton layout according to props', () => {
    const props = {
      type: ButtonType.PRIMARY,
    }
    const wrapper = shallowWithTheme(<Button.Gradient {...props}>MockChild</Button.Gradient>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct LinkButton layout according to props', () => {
    const wrapper = shallowWithTheme(<Button.Link>MockChild</Button.Link>)
    expect(wrapper).toMatchSnapshot()
  })
})
