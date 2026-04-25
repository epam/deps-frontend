
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { EmptyTableHeaders } from './EmptyTableHeaders'

jest.mock('@/utils/env', () => mockEnv)

test('renders correct layout', async () => {
  render(
    <EmptyTableHeaders />,
  )

  const title = screen.getByText(localize(Localization.EMPTY_SECTION_DISCLAIMER))
  const description = screen.getByText(localize(Localization.ADD_TABLE_ELEMENT_DESCRIPTION))

  expect(title).toBeInTheDocument()
  expect(description).toBeInTheDocument()
})
