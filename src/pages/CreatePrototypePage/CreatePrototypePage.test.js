
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { shallow } from 'enzyme'
import { useCreateExtractionFieldMutation } from '@/apiRTK/extractionFieldsApi'
import { useCreatePrototypeFieldMappingMutation, useCreatePrototypeMutation } from '@/apiRTK/prototypesApi'
import { Spin } from '@/components/Spin'
import { PageNavigationHeader } from '@/containers/PageNavigationHeader'
import { PrototypeData } from '@/containers/PrototypeData'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { Localization, localize } from '@/localization/i18n'
import { TableFieldColumn, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import {
  PrototypeField,
  PrototypeFieldMapping,
  PrototypeFieldType,
} from '@/models/PrototypeField'
import {
  PrototypeTableField,
  PrototypeTableHeader,
  PrototypeTabularMapping,
  TableHeaderType,
} from '@/models/PrototypeTableField'
import { PrototypeInfo } from '@/pages/CreatePrototypePage/PrototypeInfo'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { CreatePrototypePage } from './CreatePrototypePage'

const mockFormValues = {
  name: 'mockName',
  engine: 'mockEngine',
  language: 'mockLanguage',
}
const mockCreateResponse = { id: 'mockId' }
const mockPrototypeField = new PrototypeField({
  id: '1',
  prototypeId: 'mockId',
  name: localize(Localization.NEW_FIELD),
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.STRING,
    description: {},
  }),
  mapping: new PrototypeFieldMapping({
    keys: [],
    mappingDataType: FieldType.STRING,
    mappingType: MappingType.ONE_TO_ONE,
  }),
})

const mockPrototypeTableField = new PrototypeTableField({
  id: 'fieldId',
  prototypeId: 'mockId',
  name: 'Test Table Field',
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.TABLE,
    description: {},
  }),
  tabularMapping: new PrototypeTabularMapping({
    headerType: TableHeaderType.ROWS,
    headers: [
      new PrototypeTableHeader({
        name: 'Row name',
        aliases: ['Row alias'],
      }),
    ],
    occurrenceIndex: 1,
  }),
})

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useForm: jest.fn(() => ({
    getValues: jest.fn(() => mockFormValues),
    formState: {
      isValid: true,
    },
  })),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

const mockCreatePrototype = jest.fn(() => ({
  unwrap: () => Promise.resolve(mockCreateResponse),
}))

const mockCreatePrototypeFieldMapping = jest.fn(() => ({
  unwrap: jest.fn(),
}))

const mockCreatePrototypeTabularMapping = jest.fn(() => ({
  unwrap: jest.fn(),
}))

jest.mock('@/apiRTK/prototypesApi', () => ({
  useCreatePrototypeMutation: jest.fn(() => ([
    mockCreatePrototype,
    { isLoading: false },
  ])),
  useCreatePrototypeFieldMappingMutation: jest.fn(() => ([
    mockCreatePrototypeFieldMapping,
    { isLoading: false },
  ])),
  useCreatePrototypeTabularMappingMutation: jest.fn(() => ([
    mockCreatePrototypeTabularMapping,
    { isLoading: false },
  ])),
}))

const mockCreateExtractionField = jest.fn(() => ({
  unwrap: jest.fn(),
}))

jest.mock('@/apiRTK/extractionFieldsApi', () => ({
  useCreateExtractionFieldMutation: jest.fn(() => ([
    mockCreateExtractionField,
    { isLoading: false },
  ])),
}))

jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(),
  KnownBusinessEvent: {
    REFERENCE_LAYOUT_STATE_UPDATE: 'ReferenceLayoutStateUpdated',
  },
}))

describe('Page: CreatePrototypePage', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()

    wrapper = shallow(<CreatePrototypePage />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct header controls layout', () => {
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    expect(headerExtra).toMatchSnapshot()
  })

  it('should call createPrototype api while prototype saving', () => {
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    headerExtra.props().onClick()

    expect(mockCreatePrototype).nthCalledWith(1, mockFormValues)
  })

  it('should not call create field api while prototype saving and if there are no fields to save', async () => {
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    expect(mockCreateExtractionField).not.toHaveBeenCalled()
  })

  it('should call create field api while prototype saving and if there are fields to save', async () => {
    wrapper.find(PrototypeData).props().addField(mockPrototypeField)
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    const {
      name,
      readOnly,
      confidential,
      fieldType,
      required,
    } = mockPrototypeField

    expect(mockCreateExtractionField).nthCalledWith(1, {
      documentTypeCode: mockCreateResponse.id,
      field: {
        name,
        readOnly,
        confidential,
        fieldType: fieldType.typeCode,
        fieldMeta: fieldType.description,
        required,
      },
    })
  })

  it('should call create field mapping api while prototype saving and if there are fields to save', async () => {
    mockCreateExtractionField.mockImplementationOnce(() => ({
      unwrap: () => Promise.resolve(mockPrototypeField),
    }))

    wrapper.find(PrototypeData).props().addField(mockPrototypeField)
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    const {
      mapping,
      prototypeId,
    } = mockPrototypeField

    expect(mockCreatePrototypeFieldMapping).nthCalledWith(1, {
      prototypeId,
      field: {
        ...mockPrototypeField,
        mapping,
      },
    })
  })

  it('should call correct api on table field save', async () => {
    wrapper.find(PrototypeInfo).props().setFieldsViewType(PrototypeViewType.TABLES)
    wrapper.find(PrototypeData).props().addField(mockPrototypeTableField)

    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    const { name, tabularMapping } = mockPrototypeTableField

    expect(mockCreateExtractionField).nthCalledWith(1, {
      documentTypeCode: mockCreateResponse.id,
      field: {
        name,
        fieldType: FieldType.TABLE,
        fieldMeta: new TableFieldMeta(
          tabularMapping.headers.map((h) => (
            new TableFieldColumn(h.name)
          )),
        ),
        required: false,
      },
    })
  })

  it('should call correct tabular mapping api on table fields save', async () => {
    const mockCode = 'mockCode'

    mockCreateExtractionField.mockImplementationOnce(() => ({
      unwrap: () => Promise.resolve({ code: mockCode }),
    }))

    wrapper.find(PrototypeInfo).props().setFieldsViewType(PrototypeViewType.TABLES)
    wrapper.find(PrototypeData).props().addField(mockPrototypeTableField)

    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    expect(mockCreatePrototypeTabularMapping).nthCalledWith(1, {
      prototypeId: mockPrototypeTableField.prototypeId,
      data: {
        code: mockCode,
        ...mockPrototypeTableField.tabularMapping,
      },
    })
  })

  it('should call notifyWarning with correct message in case of field creation failure', async () => {
    const mockError = new Error('test')

    mockCreateExtractionField.mockImplementationOnce(() => ({
      unwrap: () => Promise.reject(mockError),
    }))

    wrapper.find(PrototypeData).props().addField(mockPrototypeField)
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    expect(mockNotification.notifyWarning).nthCalledWith(1, localize(Localization.PROTOTYPE_SAVING_ERROR))
  })

  it('should redirect to prototype page after prototype creation', async () => {
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    expect(goTo).nthCalledWith(1, navigationMap.documentTypes.documentType(mockCreateResponse.id))
  })

  it('should call notifyError with correct message in case of createPrototype rejection', async () => {
    const mockError = new Error('test')
    mockCreatePrototype.mockImplementationOnce(() => ({
      unwrap: () => Promise.reject(mockError),
    }))
    const headerExtra = shallow(wrapper.find(PageNavigationHeader).props().renderExtra())
    await headerExtra.props().onClick()

    expect(mockNotification.notifyError).nthCalledWith(1, localize(Localization.PROTOTYPE_SAVING_ERROR))
  })

  it('should render a spinner in case createPrototype request is in progress', async () => {
    useCreatePrototypeMutation.mockReturnValueOnce(([
      mockCreatePrototype,
      { isLoading: true },
    ]))
    wrapper = shallow(<CreatePrototypePage />)

    expect(wrapper.find(Spin.Centered).exists()).toBe(true)
  })

  it('should render a spinner in case field creation is in progress', async () => {
    useCreateExtractionFieldMutation.mockReturnValueOnce(([
      mockCreateExtractionField,
      { isLoading: true },
    ]))
    wrapper = shallow(<CreatePrototypePage />)

    expect(wrapper.find(Spin.Centered).exists()).toBe(true)
  })

  it('should render a spinner in case field mapping creation is in progress', async () => {
    useCreatePrototypeFieldMappingMutation.mockReturnValueOnce(([
      mockCreatePrototypeFieldMapping,
      { isLoading: true },
    ]))
    wrapper = shallow(<CreatePrototypePage />)

    expect(wrapper.find(Spin.Centered).exists()).toBe(true)
  })
})
