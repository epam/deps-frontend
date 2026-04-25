
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { CONFIDENCE_BREAKPOINT } from '@/constants/confidence'
import { ConfidenceFlag } from './ConfidenceFlag'
import { Flags } from './Flags'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: Flags', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      comments: [
        {
          createdAt: 'createdAtMock1',
          createdBy: 'createdByMock1',
          text: 'textMock1',
        },
        {
          createdAt: 'createdAtMock2',
          createdBy: 'createdByMock2',
          text: 'textMock2',
        },
      ],
      confidence: CONFIDENCE_BREAKPOINT.LOW,
      modifiedBy: 'modifiedByMock',
    }
    wrapper = shallow(<Flags {...defaultProps} />)
  })

  it('should render correct layout in case there is no customValidationFlags property', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render confidence flags in case confidence prop is not provided', () => {
    delete defaultProps.confidence
    wrapper = shallow(<Flags {...defaultProps} />)

    expect(wrapper.find(ConfidenceFlag).exists()).toEqual(false)
  })
})
