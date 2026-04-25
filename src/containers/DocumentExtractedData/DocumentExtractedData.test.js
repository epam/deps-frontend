
import { mockReact } from '@/mocks/mockReact'
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { usePolling } from 'use-raf-polling'
import {
  getDocumentExtractedData,
  getDocumentState,
  fetchDocumentValidation,
} from '@/actions/documentReviewPage'
import { DocumentState } from '@/enums/DocumentState'
import { useCustomFieldsGrouping } from '@/hooks/useCustomFieldsGrouping'
import { KnownBusinessEvent } from '@/hooks/useEventSource'
import { documentSelector } from '@/selectors/documentReviewPage'
import { DocumentExtractedData } from './DocumentExtractedData'

jest.mock('@/containers/DocumentExtractedData/ExtractedDataTabs', () => mockComponent('ExtractedDataTabs'))
jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/actions/documentReviewPage', () => ({
  getDocumentExtractedData: jest.fn(),
  getDocumentState: jest.fn(),
  fetchDocumentValidation: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)
jest.mock('use-raf-polling', () => ({
  usePolling: jest.fn(() => ({
    startPolling: jest.fn(),
    stopPolling: jest.fn(),
  })),
}))
jest.mock('@/hooks/useCustomFieldsGrouping', () => ({
  useCustomFieldsGrouping: jest.fn(),
}))

let mockAddEvent
let mockOnDocumentStateChanged

jest.mock('@/hooks/useEventSource', () => ({
  ...jest.requireActual('@/hooks/useEventSource/KnownBusinessEvent'),
  useEventSource: jest.fn(() => {
    mockAddEvent = jest.fn((eventName, callback) => {
      mockOnDocumentStateChanged = callback
    })
    return mockAddEvent
  }),
}))

React.useCallback.mockImplementation((fn) => fn)

const { mapDispatchToProps, mapStateToProps, ConnectedComponent } = DocumentExtractedData

test('mapStateToProps calls documentSelector with state and passes the result as document prop', () => {
  const { props } = mapStateToProps()

  expect(documentSelector).toHaveBeenCalled()
  expect(props.document).toEqual(documentSelector.getSelectorMockValue())
})

test('mapDispatchToProps passes getDocumentExtractedData as a prop', () => {
  const { props } = mapDispatchToProps()
  props.getDocumentExtractedData()

  expect(getDocumentExtractedData).toHaveBeenCalled()
})

test('mapDispatchToProps passes getDocumentState as a prop', () => {
  const { props } = mapDispatchToProps()
  props.getDocumentState()

  expect(getDocumentState).toHaveBeenCalled()
})

test('mapDispatchToProps passes fetchDocumentValidation as a prop', () => {
  const { props } = mapDispatchToProps()
  props.fetchDocumentValidation()

  expect(fetchDocumentValidation).toHaveBeenCalled()
})

test('renders correct layout', () => {
  const defaultProps = {
    document: documentSelector.getSelectorMockValue(),
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn(),
    fetchDocumentValidation: jest.fn(),
  }
  const wrapper = shallow(<ConnectedComponent {...defaultProps} />)

  expect(wrapper).toMatchSnapshot()
})

test('calls usePolling for extracted data with condition false and interval 2000 when SSE is enabled', () => {
  jest.clearAllMocks()
  React.useCallback.mockImplementation((fn) => fn)
  const defaultProps = {
    document: documentSelector.getSelectorMockValue(),
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn(),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  expect(usePolling).toHaveBeenNthCalledWith(1, {
    callback: expect.any(Function),
    onPollingSucceed: expect.any(Function),
    condition: false,
    interval: 2_000,
  })
})

test('calls usePolling for validation with condition false and interval 2000 when SSE is enabled', () => {
  jest.clearAllMocks()
  React.useCallback.mockImplementation((fn) => fn)
  const defaultProps = {
    document: documentSelector.getSelectorMockValue(),
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn(),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  expect(usePolling).toHaveBeenNthCalledWith(2, {
    callback: expect.any(Function),
    onPollingSucceed: expect.any(Function),
    condition: false,
    interval: 2_000,
  })
})

test('calls useCustomFieldsGrouping', () => {
  const defaultProps = {
    document: documentSelector.getSelectorMockValue(),
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn(),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  expect(useCustomFieldsGrouping).toHaveBeenCalled()
})

test('calls addEvent with DOCUMENT_STATE_UPDATED when FEATURE_SERVER_SENT_EVENTS is true', () => {
  const defaultProps = {
    document: documentSelector.getSelectorMockValue(),
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn(),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  expect(mockAddEvent).toHaveBeenNthCalledWith(
    1,
    KnownBusinessEvent.DOCUMENT_STATE_UPDATED,
    expect.any(Function),
  )
})

test('calls getDocumentState and getDocumentExtractedData when SSE event documentId matches and new state is in SHOULD_REFETCH_DOCUMENT_STATES', async () => {
  const mockDocument = documentSelector.getSelectorMockValue()
  const defaultProps = {
    document: {
      ...mockDocument,
      _id: 'doc-123',
    },
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn().mockResolvedValue(DocumentState.DATA_EXTRACTION),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  await mockOnDocumentStateChanged({ documentId: 'doc-123' })

  expect(defaultProps.getDocumentState).toHaveBeenNthCalledWith(1, 'doc-123')
  expect(defaultProps.getDocumentExtractedData).toHaveBeenCalledTimes(1)
})

test('calls getDocumentState and fetchDocumentValidation when SSE event documentId matches and new state is VALIDATION', async () => {
  const mockDocument = documentSelector.getSelectorMockValue()
  const defaultProps = {
    document: {
      ...mockDocument,
      _id: 'doc-456',
    },
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn().mockResolvedValue(DocumentState.VALIDATION),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  await mockOnDocumentStateChanged({ documentId: 'doc-456' })

  expect(defaultProps.getDocumentState).toHaveBeenNthCalledWith(1, 'doc-456')
  expect(defaultProps.fetchDocumentValidation).toHaveBeenCalledTimes(1)
})

test('does not call getDocumentState when SSE event documentId does not match current document', async () => {
  const mockDocument = documentSelector.getSelectorMockValue()
  const defaultProps = {
    document: {
      ...mockDocument,
      _id: 'doc-789',
    },
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn(),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  await mockOnDocumentStateChanged({ documentId: 'other-doc-id' })

  expect(defaultProps.getDocumentState).not.toHaveBeenCalled()
  expect(defaultProps.getDocumentExtractedData).not.toHaveBeenCalled()
  expect(defaultProps.fetchDocumentValidation).not.toHaveBeenCalled()
})

test('calls only fetchDocumentValidation when new state is VALIDATION and not getDocumentExtractedData', async () => {
  const mockDocument = documentSelector.getSelectorMockValue()
  const defaultProps = {
    document: {
      ...mockDocument,
      _id: 'doc-validation',
    },
    getDocumentExtractedData: jest.fn(),
    getDocumentState: jest.fn().mockResolvedValue(DocumentState.VALIDATION),
    fetchDocumentValidation: jest.fn(),
  }
  shallow(<ConnectedComponent {...defaultProps} />)

  await mockOnDocumentStateChanged({ documentId: 'doc-validation' })

  expect(defaultProps.fetchDocumentValidation).toHaveBeenNthCalledWith(1)
  expect(defaultProps.getDocumentExtractedData).not.toHaveBeenCalled()
})
