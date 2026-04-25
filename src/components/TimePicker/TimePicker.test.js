
import { mockDayjs } from '@/mocks/mockDayjs'
import dayjs from 'dayjs'
import { shallow } from 'enzyme'
import { TimePicker } from '@/components/TimePicker'

jest.mock('dayjs', () => mockDayjs())

describe('Component: TimePicker', () => {
  let defaultProps
  let component

  beforeEach(() => {
    defaultProps = {
      value: null,
      onChange: jest.fn(),
    }

    component = shallow(<TimePicker {...defaultProps} />)
  })

  it('should correct render default state', () => {
    expect(component).toMatchSnapshot()
  })

  it('should correct render with defined value', () => {
    component.setProps({ value: '20:07' })

    expect(component).toMatchSnapshot()
  })

  it('should call props.onChange with correct data case 1', () => {
    component.instance().onChange('')

    expect(defaultProps.onChange).toHaveBeenCalledWith(null)
  })

  it('should call props.onChange with correct data case 2', () => {
    component.instance().onChange(dayjs('2020-06-05T08:23:40.000Z'))

    expect(defaultProps.onChange).toHaveBeenCalledWith('2020-06-05T08:23:40.000Z')
  })
})
