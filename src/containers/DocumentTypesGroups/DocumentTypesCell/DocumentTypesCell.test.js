
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { render } from '@/utils/rendererRTL'
import { DocumentTypesCell } from './DocumentTypesCell'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentTypesListPage')

jest.mock('@/containers/LongTagsList', () => ({
  LongTagsList: jest.fn(({ tags }) => (
    tags.map((t) => <div key={t.id}>{t.text}</div>)
  )),
}))

const documentTypes = documentTypesSelector.getSelectorMockValue()
const documentTypesIds = documentTypes.map((dt) => dt.code)

test('shows document types names', async () => {
  const props = { documentTypesIds }

  render(<DocumentTypesCell {...props} />)

  documentTypes.forEach((dt) => {
    expect(screen.getByText(dt.name)).toBeInTheDocument()
  })
})
