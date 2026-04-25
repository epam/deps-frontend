
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { BulkFilesTitle } from './BulkFilesTitle'

jest.mock('@/utils/env', () => mockEnv)

test('renders correctly with all elements', () => {
  render(<BulkFilesTitle />)

  expect(screen.getByText(localize(Localization.FILES_PROPERTIES))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.BULK_FILES_DESCRIPTION))).toBeInTheDocument()
})
