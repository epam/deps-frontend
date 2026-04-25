
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { render } from '@/utils/rendererRTL'
import { FileLabelsCell } from './FileLabelsCell'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/LongTagsList', () => ({
  LongTagsList: jest.fn(({ tags }) => (
    tags.map((tag, id) => (
      <div key={id}>
        {tag.text}
      </div>
    ))
  )),
}))

const mockLabels = ['1', '2', '3', '4']

test('shows labels names', async () => {
  const props = { labels: mockLabels }

  render(<FileLabelsCell {...props} />)

  mockLabels.forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
