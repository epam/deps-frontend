
import dayjs from 'dayjs'
import { shallow } from 'enzyme'
import { DatePicker } from '@/components/DatePicker'
import {
  getUtcStartOfDay,
  getUtcEndOfDay,
} from '@/utils/dayjs'
import { TableDateRangeFilter } from './TableDateRangeFilter'

describe('Component: TableDateRangeFilter', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      confirm: jest.fn(),
      onChange: jest.fn(),
      dateRange: [
        '2021-02-28T21:00:00.000Z',
        '2021-03-04T20:59:59.999Z',
      ],
    }

    wrapper = shallow(<TableDateRangeFilter {...defaultProps} />)
  })

  it('should render component correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onChange with correct argument when date range was selected', () => {
    const args = [dayjs('2010-03-01T00:00:00.000'), dayjs('2010-03-01T23:59:59.999')]
    wrapper.find(DatePicker.RangePicker).props().onChange(args)
    expect(defaultProps.onChange).toHaveBeenCalledWith([getUtcStartOfDay(args[0]), getUtcEndOfDay(args[1])])
  })

  it('should call confirm in case of date change', () => {
    wrapper.find(DatePicker.RangePicker).props().onChange()
    expect(defaultProps.confirm).toHaveBeenCalled()
  })
})
