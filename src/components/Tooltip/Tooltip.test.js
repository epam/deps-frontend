
import { renderTooltip } from './Tooltip'

describe('Component: Tooltip', () => {
  it('should render layout correctly according to props', () => {
    const messages = ['message1', 'message2', 'message3']
    const result = renderTooltip(messages)
    expect(result).toMatchSnapshot()
  })
})
