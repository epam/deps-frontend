
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FIELD_FORM_CODE } from '@/containers/UploadDocumentsDrawer/constants'
import { render } from '@/utils/rendererRTL'
import { UploadFilesForm } from './UploadFilesForm'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Form', () => ({
  ...jest.requireActual('@/components/Form'),
  FormItem: (props) => (
    <div data-testid={`form-item-${props.field?.code}`}>
      {props.label}
      Form Item
    </div>
  ),
}))

jest.mock('@/utils/env', () => mockEnv)

test('renders files upload field when form is rendered', () => {
  render(<UploadFilesForm />)

  const uploadFilesField = screen.getByTestId(`form-item-${FIELD_FORM_CODE.FILES}`)
  expect(uploadFilesField).toBeInTheDocument()
})
