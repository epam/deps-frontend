
import { renderFlag } from './Flag'

describe('Component: Flag.js', () => {
  it('should render layout correctly according to props', () => {
    const result = renderFlag('mockMark', jest.fn(), jest.fn(), '#fff')
    expect(result).toMatchSnapshot()
  })
})
