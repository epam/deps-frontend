
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import React from 'react'
import { usePolling } from 'use-raf-polling'
import {
  clearKeyToAssign,
  setActiveLayoutId,
  setActiveTable,
} from '@/actions/prototypePage'
import { useFetchPrototypeLayoutQuery, useFetchPrototypeLayoutsQuery } from '@/apiRTK/prototypesApi'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { KnownBusinessEvent } from '@/hooks/useEventSource'
import { Localization, localize } from '@/localization/i18n'
import {
  PrototypeField,
  PrototypeFieldMapping,
  PrototypeFieldType,
} from '@/models/PrototypeField'
import { ReferenceLayout } from '@/models/ReferenceLayout'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import { notifyWarning, notifySuccess } from '@/utils/notification'
import { PrototypeReferenceLayout } from './PrototypeReferenceLayout'
import { ReferenceLayoutFieldListView } from './ReferenceLayoutFieldListView'
import { ReferenceLayoutGuard } from './ReferenceLayoutGuard'
import { ReferenceLayoutHeader } from './ReferenceLayoutHeader'
import { ReferenceLayoutViewType } from './ReferenceLayoutViewType'

const mockPrototypeId = 'prototypeId'
const mockCreateLayoutResponse = { id: 'mockId' }
const mockFile = { name: 'mockFile' }
const mockLayoutId = 'mockLayoutId'
const mockLayout = new ReferenceLayout({
  id: mockLayoutId,
  prototypeId: 'mockPrototypeId',
  blobName: 'mockBlobName',
  state: ReferenceLayoutState.READY,
  title: 'mockTitle',
  documentLayoutData: {
    documentLayoutId: 'mockId',
  },
})
const mockField = new PrototypeField({
  id: 'fieldId',
  prototypeId: 'prototypeId',
  name: 'Test Field1',
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.STRING,
    description: {},
  }),
  mapping: new PrototypeFieldMapping({
    keys: [
      'mappingKey1',
      'mappingKey2',
    ],
    mappingDataType: FieldType.STRING,
    mappingType: MappingType.ONE_TO_ONE,
  }),
  required: true,
})

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/prototypePage')
jest.mock('./ReferenceLayoutFieldListView', () => mockComponent('ReferenceLayoutFieldListView'))

jest.mock('@/actions/prototypePage', () => ({
  setActiveTable: jest.fn(),
  clearKeyToAssign: jest.fn(),
  setActiveLayoutId: jest.fn(),
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (f) => f(),
}))

const mockRefetchPrototypeLayout = jest.fn()
const mockRefetchPrototypeLayouts = jest.fn()

const mockCreatePrototypeLayout = jest.fn(() => ({
  unwrap: () => Promise.resolve(mockCreateLayoutResponse),
}))

const mockRestartPrototypeLayout = jest.fn(() => ({
  unwrap: () => Promise.resolve(),
}))

const mockDeletePrototypeLayout = jest.fn(() => ({
  unwrap: () => Promise.resolve('mockResponse'),
}))

jest.mock('@/apiRTK/prototypesApi', () => ({
  useCreatePrototypeLayoutMutation: jest.fn(() => ([
    mockCreatePrototypeLayout,
    { isLoading: false },
  ])),
  useRestartPrototypeLayoutMutation: jest.fn(() => ([
    mockRestartPrototypeLayout,
    { isLoading: false },
  ])),
  useDeletePrototypeLayoutMutation: jest.fn(() => ([
    mockDeletePrototypeLayout,
    { isLoading: false },
  ])),
  useFetchPrototypeLayoutsQuery: jest.fn(() => ({
    data: [mockLayout],
    isFetching: false,
    isError: false,
    refetch: mockRefetchPrototypeLayouts,
  })),
  useFetchPrototypeLayoutQuery: jest.fn(() => ({
    data: mockLayout,
    isFetching: false,
    isError: false,
    refetch: mockRefetchPrototypeLayout,
  })),
  prototypeLayoutApi: {
    util: {
      updateQueryData: jest.fn(),
    },
  },
}))

jest.mock('use-raf-polling', () => ({
  usePolling: jest.fn(),
}))

let mockAddEvent
let mockOnLayoutStateChanged

jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(() => {
    mockAddEvent = jest.fn((eventName, callback) => {
      mockOnLayoutStateChanged = callback
    })
    return mockAddEvent
  }),
  KnownBusinessEvent: {
    REFERENCE_LAYOUT_STATE_UPDATE: 'ReferenceLayoutStateUpdated',
  },
}))

describe('Container: PrototypeReferenceLayout', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    jest.clearAllMocks()
    defaultProps = {
      isEditMode: true,
      prototypeId: mockPrototypeId,
      prototypeFields: [mockField],
      fieldsViewType: PrototypeViewType.FIELDS,
      addField: jest.fn(),
    }

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)
  })

  it('should render the correct layout when no prototype layout is uploaded', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call createPrototypeLayout api while prototype layout uploading', () => {
    wrapper.find(ReferenceLayoutHeader).props().addLayout([mockFile])

    expect(mockCreatePrototypeLayout).nthCalledWith(1, {
      prototypeId: mockPrototypeId,
      file: mockFile,
    })
  })

  it('should call restartPrototypeLayout api when restarting a layout', async () => {
    wrapper.find(ReferenceLayoutGuard).props().restartLayout()

    await flushPromises()

    expect(mockRestartPrototypeLayout).nthCalledWith(1, {
      prototypeId: mockPrototypeId,
      layoutId: mockLayoutId,
    })
  })

  it('should call notifyWarning if restart fails', async () => {
    const mockError = new Error('testError')
    mockRestartPrototypeLayout.mockImplementationOnce(() => ({
      unwrap: () => Promise.reject(mockError),
    }))

    wrapper.find(ReferenceLayoutGuard).props().restartLayout()

    await flushPromises()

    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR_MESSAGE))
  })

  it('should render ReferenceLayoutFieldListView in case viewType is ReferenceLayoutViewType.FIELD_LIST', () => {
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [ReferenceLayoutViewType.FIELD_LIST, jest.fn()])
    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)

    expect(wrapper.find(ReferenceLayoutFieldListView).exists()).toEqual(true)
  })

  it('should call notifySuccess with correct message in case of createPrototypeLayout success', async () => {
    wrapper.find(ReferenceLayoutHeader).props().addLayout([mockFile])

    await flushPromises()

    expect(notifySuccess).nthCalledWith(1, localize(Localization.SUCCESS_UPLOAD_STATUS))
  })

  it('should call notifyWarning with correct message in case of createPrototypeLayout rejection', async () => {
    const mockError = new Error('test')
    mockCreatePrototypeLayout.mockImplementationOnce(() => ({
      unwrap: () => Promise.reject(mockError),
    }))

    wrapper.find(ReferenceLayoutHeader).props().addLayout([mockFile])

    await flushPromises()

    expect(mockNotification.notifyWarning).nthCalledWith(1, localize(Localization.FAILURE_UPLOAD_STATUS))
  })

  it('should call useFetchPrototypeLayoutQuery with correct arguments', () => {
    expect(useFetchPrototypeLayoutQuery).nthCalledWith(1,
      {
        prototypeId: defaultProps.prototypeId,
        layoutId: mockLayoutId,
      },
      {
        skip: false,
        refetchOnMountOrArgChange: true,
      },
    )
  })

  it('should call useFetchPrototypeLayoutsQuery with correct arguments', () => {
    expect(useFetchPrototypeLayoutsQuery).nthCalledWith(1,
      defaultProps.prototypeId,
      {
        refetchOnMountOrArgChange: true,
        skip: false,
      },
    )
  })

  it('call notifyWarning with correct message in case of fetchPrototypeLayout rejection', () => {
    jest.clearAllMocks()

    useFetchPrototypeLayoutQuery.mockImplementationOnce(() => ({
      data: null,
      isLoading: false,
      isError: true,
    }))

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)

    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })

  it('call notifyWarning with correct message in case of fetchPrototypeLayouts rejection', () => {
    jest.clearAllMocks()

    useFetchPrototypeLayoutsQuery.mockImplementationOnce(() => ({
      data: [],
      isFetching: false,
      isError: true,
    }))

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)

    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })

  it('should call usePolling with expected config', () => {
    expect(usePolling).nthCalledWith(1, {
      callback: mockRefetchPrototypeLayout,
      interval: 2_000,
      condition: false,
    })

    expect(usePolling).nthCalledWith(2, {
      callback: mockRefetchPrototypeLayouts,
      interval: 2_000,
      condition: false,
    })
  })

  it('should call deletePrototypeLayout api with correct arguments when deleting the last prototype layout', () => {
    useFetchPrototypeLayoutsQuery.mockImplementationOnce(() => ({
      data: [mockLayout],
      isFetching: false,
      isError: false,
    }))

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)
    wrapper.find(ReferenceLayoutHeader).props().removeLayout(mockLayoutId)

    expect(mockDeletePrototypeLayout).nthCalledWith(1, {
      prototypeId: mockPrototypeId,
      layoutId: mockLayoutId,
      isLastLayout: true,
    })
  })

  it('should call deletePrototypeLayout API with the correct arguments when deleting a prototype layout that is not the last one', () => {
    useFetchPrototypeLayoutsQuery.mockImplementationOnce(() => ({
      data: [
        mockLayout,
        {
          ...mockLayout,
          id: 'mockLayoutId2',
        },
      ],
      isFetching: false,
      isError: false,
    }))

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)
    wrapper.find(ReferenceLayoutHeader).props().removeLayout(mockLayoutId)

    expect(mockDeletePrototypeLayout).nthCalledWith(1, {
      prototypeId: mockPrototypeId,
      layoutId: mockLayoutId,
      isLastLayout: false,
    })
  })

  it('should call notifySuccess with correct message in case of deletePrototypeLayout success', async () => {
    jest.clearAllMocks()

    wrapper.find(ReferenceLayoutHeader).props().removeLayout(mockLayoutId)

    await flushPromises()

    expect(mockNotification.notifySuccess).nthCalledWith(
      1,
      localize(Localization.REFERENCE_LAYOUT_DELETE_SUCCESS, { name: mockLayout.title }),
    )
  })

  it('should call notifyWarning with correct message in case of deletePrototypeLayout rejection', async () => {
    jest.clearAllMocks()

    const mockError = new Error('test')
    mockDeletePrototypeLayout.mockImplementationOnce(() => ({
      unwrap: () => Promise.reject(mockError),
    }))

    wrapper.find(ReferenceLayoutHeader).props().removeLayout(mockLayoutId)

    await flushPromises()

    expect(mockNotification.notifyWarning).nthCalledWith(
      1,
      localize(Localization.REFERENCE_LAYOUT_DELETE_FAILED),
    )
  })

  it('should call clearKeyToAssign and setActiveTable on view change', async () => {
    wrapper.find(ReferenceLayoutHeader).props().onViewChange(ReferenceLayoutViewType.FIELD_LIST)

    expect(clearKeyToAssign).toHaveBeenCalled()
    expect(setActiveTable).nthCalledWith(1, null)
  })

  it('should call setActiveLayoutId with the ID of the first prototype in the list on initial load', async () => {
    activeLayoutIdSelector.mockReturnValueOnce(null)

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)

    expect(setActiveLayoutId).nthCalledWith(1, mockLayout.id)
  })

  it('should not call setActiveLayoutId if there is already an active layout', async () => {
    activeLayoutIdSelector.mockReturnValueOnce(mockLayout.id)

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)

    expect(setActiveLayoutId).not.toHaveBeenCalled()
  })

  it('should not call setActiveLayoutId on initial load if there is no layouts list', async () => {
    activeLayoutIdSelector.mockReturnValueOnce(null)

    useFetchPrototypeLayoutsQuery.mockReturnValueOnce({
      data: [],
      isFetching: false,
      isError: false,
    })

    wrapper = shallow(<PrototypeReferenceLayout {...defaultProps} />)

    expect(setActiveLayoutId).not.toHaveBeenCalled()
  })

  it('should call addEvent from useEventSource with correct arguments when SSE is enabled', () => {
    expect(mockAddEvent).toHaveBeenCalledWith(
      KnownBusinessEvent.REFERENCE_LAYOUT_STATE_UPDATE,
      expect.any(Function),
    )
  })

  it('should refetch layout and layouts list when layout is in processing and its state changes', async () => {
    const layout = {
      ...mockLayout,
      state: ReferenceLayoutState.NEW,
    }

    useFetchPrototypeLayoutQuery.mockImplementationOnce(() => ({
      data: layout,
      isLoading: false,
      isError: false,
      refetch: mockRefetchPrototypeLayout,
    }))

    useFetchPrototypeLayoutsQuery.mockImplementationOnce(() => ({
      data: [layout],
      isFetching: false,
      isError: false,
      refetch: mockRefetchPrototypeLayouts,
    }))

    shallow(<PrototypeReferenceLayout {...defaultProps} />)

    const eventData = {
      prototypeId: mockPrototypeId,
      referenceLayoutId: mockLayoutId,
      state: ReferenceLayoutState.UNIFICATION,
    }

    await mockOnLayoutStateChanged(eventData)

    expect(mockRefetchPrototypeLayout).toHaveBeenCalled()
    expect(mockRefetchPrototypeLayouts).toHaveBeenCalled()
  })
})
