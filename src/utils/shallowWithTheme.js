
import { shallow } from 'enzyme'
import { ThemeConsumer } from 'styled-components'
import { theme } from '@/theme/theme.default'

const shallowWithTheme = (children, defaultTheme = theme) => {
  ThemeConsumer._currentValue = defaultTheme
  return shallow(children)
}

export {
  shallowWithTheme,
}
