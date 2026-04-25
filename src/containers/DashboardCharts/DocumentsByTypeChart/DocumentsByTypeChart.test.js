
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import ShallowRenderer from 'react-test-renderer/shallow'
import { documentsApi } from '@/api/documentsApi'
import { PaginationKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { Chart } from './Chart'
import { DocumentsByTypeChart } from './DocumentsByTypeChart'

const totalDocuments = 10
const mockResponse = {
  meta: {
    total: totalDocuments,
  },
}

jest.mock('./Chart', () => ({
  Chart: jest.fn(() => 'Chart'),
}))

jest.mock('@/components/Spin', () => ({
  Spin: {
    Centered: () => 'Spin',
  },
}))

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    getDocuments: jest.fn(() => Promise.resolve(mockResponse)),
  },
}))

jest.mock('@/utils/notification', () => ({
  notifyWarning: jest.fn(),
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DocumentStatesByTypeDrawer', () => mockComponent('DocumentStatesByTypeDrawer'))

const testId = 'testId'
const testCode = 'testCode'
const defaultProps = {
  docTypesList: [
    {
      id: 'testId1',
      documentType: 'Test Document Type 1',
      code: testCode,
    },
    {
      id: testId,
      documentType: 'Test Document Type 2',
    },
  ],
  isFetching: false,
}

describe('Component DocumentsByTypeChart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correct layout', () => {
    const renderer = new ShallowRenderer()
    const wrapper = renderer.render(<DocumentsByTypeChart {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Spin if content is fetching', async () => {
    const props = {
      ...defaultProps,
      isFetching: true,
    }

    render(<DocumentsByTypeChart {...props} />)

    expect(await screen.findByText('Spin')).toBeDefined()
  })

  it('should call documentsApi.getDocuments proper number of times with proper arguments', async () => {
    render(<DocumentsByTypeChart {...defaultProps} />)

    await waitFor(async () => {
      await expect(documentsApi.getDocuments).nthCalledWith(1, {
        [PaginationKeys.PAGE]: 1,
        [PaginationKeys.PER_PAGE]: 1,
        types: [testCode],
      })
      await expect(documentsApi.getDocuments).nthCalledWith(2, {
        [PaginationKeys.PAGE]: 1,
        [PaginationKeys.PER_PAGE]: 1,
        types: [testId],
      })
    })
  })

  it('should show notification if documentsApi.getDocuments was rejected', async () => {
    const mockReason = 'mockReason'
    documentsApi.getDocuments.mockImplementationOnce(() => Promise.reject(mockReason))

    render(<DocumentsByTypeChart {...defaultProps} />)

    await waitFor(async () => {
      expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
    })
  })

  it('should render Chart component with defined properties', async () => {
    render(<DocumentsByTypeChart {...defaultProps} />)

    await waitFor(async () => {
      expect(Chart).nthCalledWith(2, {
        data: [
          {
            code: testCode,
            count: totalDocuments,
            id: 'testId1',
            documentType: 'Test Document Type 1',
          },
          {
            code: undefined,
            count: totalDocuments,
            id: testId,
            documentType: 'Test Document Type 2',
          },
        ],
        onClick: expect.any(Function),
      }, {})
    })
  })
})
