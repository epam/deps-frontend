
import { mockEnv } from '@/mocks/mockEnv'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { Field } from '../viewModels'
import {
  confirmHandler,
  getTooltipConfig,
  getActiveFieldIndex,
  sendBatchRequests,
  parsePageSpanToContent,
} from './utils'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Modal', () => ({
  Modal: {
    confirm: jest.fn(),
  },
}))

describe('utils: confirmHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls callback immediately when condition is false', () => {
    const mockCallback = jest.fn()
    const condition = false
    const title = 'Test Title'

    confirmHandler(mockCallback, condition, title)

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(Modal.confirm).not.toHaveBeenCalled()
  })

  test('shows modal confirmation when condition is true', () => {
    const mockCallback = jest.fn()
    const condition = true
    const title = 'Confirm Action'

    confirmHandler(mockCallback, condition, title)

    expect(Modal.confirm).toHaveBeenCalledWith({
      title: 'Confirm Action',
      onOk: mockCallback,
    })
    expect(mockCallback).not.toHaveBeenCalled()
  })

  test('calls callback when modal is confirmed', () => {
    const mockCallback = jest.fn()
    const condition = true
    const title = 'Confirm Action'

    Modal.confirm.mockImplementationOnce((config) => {
      config.onOk()
    })

    confirmHandler(mockCallback, condition, title)

    expect(Modal.confirm).toHaveBeenCalled()
    expect(mockCallback).toHaveBeenCalledTimes(1)
  })
})

describe('utils: getTooltipConfig', () => {
  test('returns tooltip configuration object with title', () => {
    const text = 'Tooltip text'
    const result = getTooltipConfig(text)

    expect(result).toEqual({
      title: 'Tooltip text',
    })
  })

  test('handles empty string', () => {
    const text = ''
    const result = getTooltipConfig(text)

    expect(result).toEqual({
      title: '',
    })
  })

  test('handles null', () => {
    const text = null
    const result = getTooltipConfig(text)

    expect(result).toEqual({
      title: null,
    })
  })
})

describe('utils: getActiveFieldIndex', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      name: 'Field 1',
    }),
    new Field({
      id: 'field-2',
      name: 'Field 2',
    }),
    new Field({
      id: 'field-3',
      name: 'Field 3',
    }),
  ]

  test('returns correct index when field is found', () => {
    const activeField = mockFields[1]
    const result = getActiveFieldIndex(mockFields, activeField)

    expect(result).toBe(1)
  })

  test('returns 0 for first field', () => {
    const activeField = mockFields[0]
    const result = getActiveFieldIndex(mockFields, activeField)

    expect(result).toBe(0)
  })

  test('returns correct index for last field', () => {
    const activeField = mockFields[2]
    const result = getActiveFieldIndex(mockFields, activeField)

    expect(result).toBe(2)
  })

  test('returns -1 when field is not found', () => {
    const activeField = new Field({
      id: 'non-existent',
      name: 'Non-existent',
    })
    const result = getActiveFieldIndex(mockFields, activeField)

    expect(result).toBe(-1)
  })

  test('returns -1 for empty fields array', () => {
    const activeField = mockFields[0]
    const result = getActiveFieldIndex([], activeField)

    expect(result).toBe(-1)
  })

  test('handles field with matching id but different object reference', () => {
    const activeField = new Field({
      id: 'field-2',
      name: 'Different Name',
    })
    const result = getActiveFieldIndex(mockFields, activeField)

    expect(result).toBe(1)
  })
})

describe('utils: sendBatchRequests', () => {
  test('sends batch requests correctly', async () => {
    const requests = [
      jest.fn(),
      jest.fn(),
      jest.fn(),
      jest.fn(),
    ]

    await sendBatchRequests(requests, 2)

    expect(requests[0]).toHaveBeenCalledTimes(1)
    expect(requests[1]).toHaveBeenCalledTimes(1)
    expect(requests[2]).toHaveBeenCalledTimes(1)
    expect(requests[3]).toHaveBeenCalledTimes(1)
  })
})

describe('utils: parsePageSpanToContent', () => {
  test('returns correct content', () => {
    const pageSpan = {
      start: 1,
      end: 10,
    }
    const result = parsePageSpanToContent(pageSpan)

    expect(result).toEqual('1 - 10')
  })

  test('returns correct content when page span is not provided', () => {
    const result = parsePageSpanToContent(null)

    expect(result).toEqual(localize(Localization.ALL_PAGES))
  })
})
