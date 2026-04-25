/* eslint-disable testing-library/no-render-in-setup */

import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import { usePolling } from 'use-raf-polling'
import {
  saveDocument,
  completeReview,
  getDocumentState,
} from '@/actions/documentReviewPage'
import { DocumentState } from '@/enums/DocumentState'
import { KnownBusinessEvent } from '@/hooks/useEventSource'
import { localize, Localization } from '@/localization/i18n'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { documentSelector, idSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { render } from '@/utils/rendererRTL'
import { CompleteReviewButton } from './'

jest.mock('@/selectors/documentReviewPage')
jest.mock('@/selectors/requests')
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

let mockOnPollingSucceed
let mockAddEvent
let mockOnDocumentStateChanged

jest.mock('@/hooks/useEventSource', () => ({
  useEventSource: jest.fn(() => {
    mockAddEvent = jest.fn((eventName, callback) => {
      mockOnDocumentStateChanged = callback
    })
    return mockAddEvent
  }),
  KnownBusinessEvent: {
    DOCUMENT_STATE_UPDATED: 'DocumentStateUpdated',
  },
}))

jest.mock('use-raf-polling', () => ({
  usePolling: jest.fn(({ onPollingSucceed }) => {
    mockOnPollingSucceed = onPollingSucceed
  }),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  ...mockReactRedux,
}))

const mockDocumentActions = {
  saveDocument: 'mockSaveDocument',
  completeReview: 'mockCompleteReview',
  getDocumentState: 'mockGetDocumentState',
}

jest.mock('@/actions/documentReviewPage', () => ({
  saveDocument: jest.fn(() => mockDocumentActions.saveDocument),
  completeReview: jest.fn(() => mockDocumentActions.completeReview),
  getDocumentState: jest.fn(() => mockDocumentActions.getDocumentState),
  fetchDocumentValidation: jest.fn(),
}))

const { mapStateToProps, ConnectedComponent } = CompleteReviewButton

describe('Container: CompleteReviewButton', () => {
  describe('connected Component', () => {
    let defaultProps
    const renderer = new ShallowRenderer()

    beforeEach(() => {
      jest.clearAllMocks()
      ENV.FEATURE_SERVER_SENT_EVENTS = true

      defaultProps = {
        getDocumentState: jest.fn(),
        fetchDocumentValidation: jest.fn(),
        fetching: false,
        completeReview: jest.fn(),
        saveDocument: jest.fn(),
        document: documentSelector.getSelectorMockValue(),
      }
    })

    it('should call usePolling with expected config when SSE is enabled', () => {
      ENV.FEATURE_SERVER_SENT_EVENTS = true
      defaultProps.document.state = DocumentState.IN_REVIEW

      render(<ConnectedComponent {...defaultProps} />)

      expect(usePolling).nthCalledWith(1, {
        callback: defaultProps.getDocumentState,
        interval: 2000,
        condition: false,
        onPollingSucceed: expect.any(Function),
      })
    })

    it('should call usePolling with condition true when SSE is disabled and document is in VALIDATION state', () => {
      ENV.FEATURE_SERVER_SENT_EVENTS = false
      defaultProps.document.state = DocumentState.VALIDATION

      render(<ConnectedComponent {...defaultProps} />)

      expect(usePolling).nthCalledWith(1, {
        callback: defaultProps.getDocumentState,
        interval: 2000,
        condition: true,
        onPollingSucceed: expect.any(Function),
      })
    })

    it('should call usePolling with condition false when SSE is disabled and document is not in VALIDATION state', () => {
      ENV.FEATURE_SERVER_SENT_EVENTS = false
      defaultProps.document.state = DocumentState.IN_REVIEW

      render(<ConnectedComponent {...defaultProps} />)

      expect(usePolling).nthCalledWith(1, {
        callback: defaultProps.getDocumentState,
        interval: 2000,
        condition: false,
        onPollingSucceed: expect.any(Function),
      })
    })

    it('should render correct layout', () => {
      const wrapper = renderer.render(<ConnectedComponent {...defaultProps} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('should call notifyRequest on button click', async () => {
      render(<ConnectedComponent {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', {
        name: localize(Localization.COMPLETE_REVIEW),
      }))

      expect(mockNotification.notifySuccess).nthCalledWith(1, localize(Localization.COMPLETE_REVIEW_DOCUMENT_SUCCESSFUL))
    })

    it('should call saveDocument on button click if extracted data was modified', async () => {
      const modifiedED = [
        new ExtractedDataField(
          1,
          new FieldData(
            350,
            new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5),
            0.69,
            null,
            1,
            null,
            null,
            'Mock modifier',
          ),
        )]

      defaultProps = {
        ...defaultProps,
        document: {
          ...defaultProps.document,
          extractedData: modifiedED,
        },
      }

      render(<ConnectedComponent {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', {
        name: localize(Localization.COMPLETE_REVIEW),
      }))

      expect(defaultProps.saveDocument).toHaveBeenCalled()
    })

    it('should not call save document on button click if extracted data was not modified', async () => {
      const nonModifiedData = [
        new ExtractedDataField(
          1,
          new FieldData(
            350,
            new FieldCoordinates(2, 0.19, 0.26, 0.80, 0.5),
            0.69,
          ),
        ),
      ]

      defaultProps = {
        ...defaultProps,
        document: {
          ...defaultProps.document,
          extractedData: nonModifiedData,
        },
      }

      render(<ConnectedComponent {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', {
        name: localize(Localization.COMPLETE_REVIEW),
      }))

      expect(defaultProps.saveDocument).not.toHaveBeenCalled()
    })

    it('should call completeReview on button click', async () => {
      render(<ConnectedComponent {...defaultProps} />)

      await userEvent.click(screen.getByRole('button', {
        name: localize(Localization.COMPLETE_REVIEW),
      }))

      expect(defaultProps.completeReview).toHaveBeenCalled()
    })

    it('should call fetchDocumentValidation on polling succeed and not notify warning when validation is null', async () => {
      defaultProps.fetchDocumentValidation = jest.fn().mockResolvedValue(null)
      render(<ConnectedComponent {...defaultProps} />)
      await mockOnPollingSucceed()
      expect(defaultProps.fetchDocumentValidation).toHaveBeenCalled()
      expect(mockNotification.notifyWarning).not.toHaveBeenCalled()
    })

    it('should not notify warning when validation result is valid', async () => {
      const invalidValidation = { isValid: true }
      defaultProps.fetchDocumentValidation = jest.fn().mockResolvedValue(invalidValidation)
      render(<ConnectedComponent {...defaultProps} />)
      await mockOnPollingSucceed()
      expect(defaultProps.fetchDocumentValidation).toHaveBeenCalled()
      expect(mockNotification.notifyWarning).not.toHaveBeenCalled()
    })

    it('should notify warning when validation result is invalid', async () => {
      const invalidValidation = { isValid: false }
      defaultProps.fetchDocumentValidation = jest.fn().mockResolvedValue(invalidValidation)
      render(<ConnectedComponent {...defaultProps} />)
      await mockOnPollingSucceed()
      expect(defaultProps.fetchDocumentValidation).toHaveBeenCalled()
      expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.COMPLETE_REVIEW_IMPOSSIBLE_DUE_TO_ERROR))
    })

    describe('SSE event handling', () => {
      beforeEach(() => {
        ENV.FEATURE_SERVER_SENT_EVENTS = true
        defaultProps.document = {
          ...documentSelector.getSelectorMockValue(),
          _id: 'test-document-id',
          state: DocumentState.IN_REVIEW,
        }
        defaultProps.getDocumentState = jest.fn().mockResolvedValue(undefined)
        defaultProps.fetchDocumentValidation = jest.fn().mockResolvedValue({ isValid: true })
      })

      it('should call addEvent from useEventSource with correct arguments when SSE is enabled', () => {
        render(<ConnectedComponent {...defaultProps} />)

        expect(mockAddEvent).toHaveBeenCalledWith(
          KnownBusinessEvent.DOCUMENT_STATE_UPDATED,
          expect.any(Function),
        )
      })

      it('should not call addEvent from useEventSource when SSE is disabled', () => {
        ENV.FEATURE_SERVER_SENT_EVENTS = false
        jest.clearAllMocks()

        render(<ConnectedComponent {...defaultProps} />)

        expect(mockAddEvent).not.toHaveBeenCalled()
      })

      it('should call getDocumentState and fetchDocumentValidation when document state changes to VALIDATION', async () => {
        render(<ConnectedComponent {...defaultProps} />)

        const eventData = {
          documentId: 'test-document-id',
          state: DocumentState.VALIDATION,
        }

        await mockOnDocumentStateChanged(eventData)

        expect(defaultProps.getDocumentState).toHaveBeenCalled()
        expect(defaultProps.fetchDocumentValidation).toHaveBeenCalled()
      })

      it('should not call getDocumentState when document state changes to a different state', async () => {
        render(<ConnectedComponent {...defaultProps} />)

        const eventData = {
          documentId: 'test-document-id',
          state: DocumentState.IN_REVIEW,
        }

        await mockOnDocumentStateChanged(eventData)

        expect(defaultProps.getDocumentState).not.toHaveBeenCalled()
        expect(defaultProps.fetchDocumentValidation).not.toHaveBeenCalled()
      })

      it('should not call getDocumentState when event is for a different document', async () => {
        render(<ConnectedComponent {...defaultProps} />)

        const eventData = {
          documentId: 'different-document-id',
          state: DocumentState.VALIDATION,
        }

        await mockOnDocumentStateChanged(eventData)

        expect(defaultProps.getDocumentState).not.toHaveBeenCalled()
        expect(defaultProps.fetchDocumentValidation).not.toHaveBeenCalled()
      })

      it('should call fetchDocumentValidation after getDocumentState when state changes to VALIDATION', async () => {
        const callOrder = []
        defaultProps.getDocumentState = jest.fn().mockImplementation(async () => {
          callOrder.push('getDocumentState')
        })
        defaultProps.fetchDocumentValidation = jest.fn().mockImplementation(async () => {
          callOrder.push('fetchDocumentValidation')
        })

        render(<ConnectedComponent {...defaultProps} />)

        const eventData = {
          documentId: 'test-document-id',
          state: DocumentState.VALIDATION,
        }

        await mockOnDocumentStateChanged(eventData)

        expect(callOrder).toEqual(['getDocumentState', 'fetchDocumentValidation'])
      })

      it('should notify warning when validation result is invalid after SSE event', async () => {
        defaultProps.fetchDocumentValidation = jest.fn().mockResolvedValue({ isValid: false })

        render(<ConnectedComponent {...defaultProps} />)

        const eventData = {
          documentId: 'test-document-id',
          state: DocumentState.VALIDATION,
        }

        await mockOnDocumentStateChanged(eventData)

        expect(defaultProps.fetchDocumentValidation).toHaveBeenCalled()
        expect(mockNotification.notifyWarning).toHaveBeenCalledWith(
          localize(Localization.COMPLETE_REVIEW_IMPOSSIBLE_DUE_TO_ERROR),
        )
      })
    })
  })

  describe('mapStateToProps', () => {
    it('should call to idSelector with state and pass the result as id prop', () => {
      const { props } = mapStateToProps()

      expect(idSelector).toHaveBeenCalled()
      expect(props.documentId).toEqual(idSelector.getSelectorMockValue())
    })

    it('should call to documentSelector with state and pass the result as document prop', () => {
      const { props } = mapStateToProps()

      expect(documentSelector).toHaveBeenCalled()
      expect(props.document).toEqual(documentSelector.getSelectorMockValue())
    })
  })

  describe('mergeProps', () => {
    const mergeProps = CompleteReviewButton.mergeProps
    const mockMapDispatch = { dispatch: jest.fn() }
    const mockStateProps = {
      document: documentSelector.getSelectorMockValue(),
      fetching: false,
      documentId: idSelector.getSelectorMockValue(),
    }

    let props, dispatch

    beforeEach(() => {
      const mergedProps = mergeProps(mockStateProps, mockMapDispatch)
      props = mergedProps.props
      dispatch = mergedProps.dispatch
    })

    it('should dispatch saveDocument when calling to saveDocument with correct parameters', () => {
      props.saveDocument()
      expect(saveDocument).toHaveBeenCalledTimes(1)
      expect(saveDocument).toHaveBeenCalledWith(mockStateProps.document)
      expect(dispatch).toHaveBeenCalledWith(mockDocumentActions.saveDocument)
    })

    it('should dispatch completeReview when calling to completeReview with correct parameters', () => {
      props.completeReview()
      expect(completeReview).toHaveBeenCalledTimes(1)
      expect(completeReview).toHaveBeenCalledWith(mockStateProps.documentId)
      expect(dispatch).toHaveBeenCalledWith(mockDocumentActions.completeReview)
    })

    it('should dispatch getDocumentState when calling to getDocumentState prop with correct parameter', () => {
      props.getDocumentState()
      expect(getDocumentState).toHaveBeenCalledTimes(1)
      expect(getDocumentState).toHaveBeenCalledWith(mockStateProps.documentId)
      expect(dispatch).toHaveBeenCalledWith(mockDocumentActions.getDocumentState)
    })
  })
})
