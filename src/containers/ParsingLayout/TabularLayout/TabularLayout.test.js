
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import { TabularLayout } from '@/containers/ParsingLayout/TabularLayout'
import { KnownTabularLayoutParsingType } from '@/enums/KnownTabularLayoutParsingType'
import { Localization, localize } from '@/localization/i18n'
import { TabularLayoutInfo, SheetInfo, TableInfo } from '@/models/DocumentParsingInfo'
import { render } from '@/utils/rendererRTL'

jest.mock('@/utils/env', () => mockEnv)

const ParsedTablesComponent = 'ParsedTables'

jest.mock('./ParsedTables', () => mockComponent(ParsedTablesComponent))

const mockSheet = new SheetInfo({
  id: 'mockSheetId',
  title: 'Mock Title',
  isHidden: false,
  tables: [
    new TableInfo({
      id: 'mockId',
      rowCount: 1,
      columnCount: 1,
    }),
  ],
  images: [],
})

const tabularLayoutInfo = new TabularLayoutInfo({
  id: 'mockId',
  parsingType: KnownTabularLayoutParsingType.EXCEL,
  sheets: [mockSheet],
})

test('shows correct layout', async () => {
  render(
    <TabularLayout
      layoutInfo={tabularLayoutInfo}
    />,
  )

  const dropdownButton = screen.getByRole('button', {
    name: mockSheet.title,
  })
  const totalNumberText = screen.getByText(localize(Localization.TOTAL_NUMBER))
  const totalNumberValue = within(totalNumberText).getByText(localize(Localization.TOTAL_NUMBER))

  expect(dropdownButton).toBeInTheDocument()
  expect(totalNumberText).toBeInTheDocument()
  expect(totalNumberValue).toBeInTheDocument()
  expect(screen.getByText(ParsedTablesComponent)).toBeInTheDocument()
})
