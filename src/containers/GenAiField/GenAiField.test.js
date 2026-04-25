
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { deleteFields, updateField } from '@/actions/genAiData'
import { Localization, localize } from '@/localization/i18n'
import { GenAiField as GenAiFieldModel } from '@/models/GenAiField'
import { areGenAiFieldsDeletingSelector, areGenAiFieldsFetchingSelector } from '@/selectors/requests'
import { FieldControls } from './FieldControls'
import { KeyField } from './KeyField'
import { ValueField } from './ValueField'
import { GenAiField } from '.'

const mockDispatch = jest.fn((action) => action)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))
jest.mock('@/actions/genAiData', () => ({
  deleteFields: jest.fn(),
  updateField: jest.fn(),
}))

jest.mock('@/selectors/requests')
jest.mock('@/utils/notification', () => mockNotification)

describe('Component: GenAiField', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    jest.clearAllMocks()
    defaultProps = {
      field: new GenAiFieldModel({
        key: 'mockKey',
        value: 'mockValue',
        id: 'mockId',
      }),
    }

    wrapper = shallow(<GenAiField {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call dispatch with deleteFields action when calling to deleteField method', () => {
    wrapper.find(FieldControls).props().onDelete()
    const { id } = defaultProps.field

    expect(mockDispatch).nthCalledWith(1, deleteFields([id]))
  })

  it('should call notifyRequest with correct message in case of success field deletion', async () => {
    wrapper.find(FieldControls).props().onDelete()
    const { key } = defaultProps.field

    await flushPromises()

    expect(mockNotification.notifySuccess).nthCalledWith(1, localize(Localization.DELETE_GEN_AI_FIELD_MESSAGE, { key }))
  })

  it('should call notifyRequest with correct message in case of field deletion is in progress', async () => {
    wrapper.find(FieldControls).props().onDelete()
    const { key } = defaultProps.field

    expect(mockNotification.notifyProgress).nthCalledWith(1, localize(Localization.DELETE_GEN_AI_FIELD_MESSAGE_IN_PROGRESS, { key }))
  })

  it('should call dispatch with updateField action when calling to updateKey method', () => {
    const mockEvent = {
      target: {
        value: 'mockEventValue',
      },
    }

    wrapper.find(KeyField).props().updateField(mockEvent)

    expect(mockDispatch).nthCalledWith(1, updateField({
      ...defaultProps.field,
      key: mockEvent.target.value,
    }))
  })

  it('should call dispatch with updateField action when calling to updateValue method', () => {
    const mockValue = 'mockEventValue'
    wrapper.find(ValueField).props().updateField(mockValue)

    expect(mockDispatch).nthCalledWith(1, updateField({
      ...defaultProps.field,
      value: mockValue,
    }))
  })

  it('should not call dispatch in case value was not changed', () => {
    wrapper.find(ValueField).props().updateField(defaultProps.field.value)

    expect(mockDispatch).not.toBeCalled()
  })

  it('should not call dispatch in case key was not changed', () => {
    const mockEvent = {
      target: {
        value: defaultProps.field.key,
      },
    }
    wrapper.find(KeyField).props().updateField(mockEvent)

    expect(mockDispatch).not.toBeCalled()
  })

  it('should disabled field controls if fields are fetching', () => {
    areGenAiFieldsFetchingSelector.mockImplementationOnce(() => true)
    wrapper = shallow(<GenAiField {...defaultProps} />)

    expect(wrapper.find(FieldControls).props().disabled).toEqual(true)
  })

  it('should disabled field controls if fields are deleting', () => {
    areGenAiFieldsDeletingSelector.mockImplementationOnce(() => true)
    wrapper = shallow(<GenAiField {...defaultProps} />)

    expect(wrapper.find(FieldControls).props().disabled).toEqual(true)
  })
})
