
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { removeLabel } from '@/actions/documents'
import { LabelTags } from './LabelTags'

const mockRemoveLabel = 'mockRemoveLabel'
const mockDocumentId = 'testDocumentId'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/documents', () => ({
  removeLabel: jest.fn(() => Promise.resolve(mockRemoveLabel)),
}))

const { mergeProps } = LabelTags

describe('Container: LabelTags', () => {
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      id: mockDocumentId,
      labels: [
        mockRemoveLabel,
        'label2',
      ],
    }
  })

  describe('mapDispatchToProps', () => {
    it('should dispatch removeLabel action', async () => {
      const { props } = mergeProps(null, { dispatch: jest.fn() }, defaultProps)
      await props.removeLabel(mockRemoveLabel, mockDocumentId)
      expect(removeLabel).toHaveBeenCalledWith(mockRemoveLabel, mockDocumentId)
    })
  })
})
