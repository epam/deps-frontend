
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import ShallowRenderer from 'react-test-renderer/shallow'
import { Chart } from './Chart'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@nivo/bar', () => mockComponent('ResponsiveBar'))

describe('Component Chart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const data = [
    {
      code: 'testCode',
      count: 5,
      id: 'testId1',
      documentType: 'Test Name 1',
    },
    {
      count: 10,
      id: 'testId2',
      documentType: 'Test Name 2',
    },
  ]

  it('should render correct layout', () => {
    const renderer = new ShallowRenderer()
    const wrapper = renderer.render(
      <Chart
        data={data}
        onClick={jest.fn()}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
