
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Placement } from '@/enums/Placement'
import { FieldLabel } from './FieldLabel'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: FieldLabel', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      active: false,
      clickable: true,
      modifiedBy: 'Mick Duo',
      onClick: jest.fn(),
      onErrorFlagClick: jest.fn(),
      onWarningFlagClick: jest.fn(),
      label: 'Label :',
      required: true,
      customFlags: [{
        symbol: 'A',
        title: 'A symbol title',
        type: 'info',
        tooltipPlacement: Placement.TOP,
      }, {
        symbol: 'B',
        title: 'B symbol title',
        type: 'info',
        tooltipPlacement: Placement.TOP,
      }],
    }

    wrapper = shallow(<FieldLabel {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
