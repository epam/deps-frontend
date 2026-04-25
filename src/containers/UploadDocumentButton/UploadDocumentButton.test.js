
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import ShallowRenderer from 'react-test-renderer/shallow'
import { UploadDocumentButton } from './UploadDocumentButton'

jest.mock('@/containers/DocumentUpload', () => mockComponent('DocumentUpload'))
jest.mock('@/utils/env', () => mockEnv)

describe('Container: UploadDocumentButton', () => {
  it('should render correct layout', async () => {
    const renderer = new ShallowRenderer()
    const wrapper = renderer.render(<UploadDocumentButton />)
    expect(wrapper).toMatchSnapshot()
  })
})
