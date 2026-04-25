
import { useState } from 'react'
import { tabularLayoutInfoShape } from '@/models/DocumentParsingInfo'
import { ParsedTables } from './ParsedTables'
import { SheetsDropdown } from './SheetsDropdown'
import { Header } from './TabularLayout.styles'

const TabularLayout = ({
  layoutInfo,
}) => {
  const [initialActiveSheet] = layoutInfo.sheets
  const [activeSheet, setActiveSheet] = useState(initialActiveSheet)

  const renderDropdown = () => (
    <SheetsDropdown
      activeSheet={activeSheet}
      setActiveSheet={setActiveSheet}
      sheets={layoutInfo.sheets}
    />
  )

  return (
    <>
      <Header
        renderActions={renderDropdown}
        total={activeSheet.tables.length}
      />
      <ParsedTables
        activeSheetId={activeSheet.id}
        sheetsInfo={layoutInfo.sheets}
        tablesInfo={activeSheet.tables}
      />
    </>
  )
}

TabularLayout.propTypes = {
  layoutInfo: tabularLayoutInfoShape.isRequired,
}

export {
  TabularLayout,
}
