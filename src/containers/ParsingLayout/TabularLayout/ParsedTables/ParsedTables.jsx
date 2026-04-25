
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { getTabularLayout, getFileTabularLayout } from '@/api/parsingApi'
import { ArrowRotateLeftIcon } from '@/components/Icons/ArrowRotateLeftIcon'
import { Spin } from '@/components/Spin'
import { Localization, localize } from '@/localization/i18n'
import { tableInfoShape, sheetInfoShape } from '@/models/DocumentParsingInfo'
import { notifyWarning } from '@/utils/notification'
import { TableField } from '../TableField'
import { TabularLayoutRequestConfig } from '../TabularLayoutRequestConfig'
import { calculateTablesSizeToFetchAtOnce } from './calculateTablesSizeToFetchAtOnce'
import { Button, Wrapper } from './ParsedTables.styles'

const START_INDEX = 0

const getRequestConfig = (
  tablesInfo,
  initialRowIndex = START_INDEX,
  initialColumnIndex = START_INDEX,
) => {
  const { tables, rows, cols } = calculateTablesSizeToFetchAtOnce(tablesInfo)

  return new TabularLayoutRequestConfig({
    tables,
    rowSpan: [initialRowIndex, rows],
    colSpan: [initialColumnIndex, cols],
  })
}

const ParsedTables = ({
  tablesInfo,
  activeSheetId,
  sheetsInfo,
}) => {
  const [tables, setTables] = useState({})
  const [isFetching, setIsFetching] = useState(false)

  const { documentId, fileId } = useParams()
  const entityId = documentId || fileId
  const activeSheetIndex = sheetsInfo.findIndex(({ id }) => id === activeSheetId)

  const tablesToFetch = useMemo(() => (
    tablesInfo.filter(({ id }) => !Object.keys(tables).includes(id))
  ), [tables, tablesInfo])

  const fetchTabularLayout = useCallback(async (tablesConfig) => {
    try {
      setIsFetching(true)
      const getLayoutFunction = fileId ? getFileTabularLayout : getTabularLayout
      const { tables } = await getLayoutFunction(entityId, tablesConfig)
      setTables((prevData) => ({
        ...prevData,
        ...tables,
      }))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsFetching(false)
    }
  }, [
    entityId,
    fileId,
  ])

  useEffect(() => {
    setTables({})

    if (tablesInfo.length === 0) {
      return
    }

    const tablesConfig = getRequestConfig(tablesInfo)
    fetchTabularLayout(tablesConfig)
  }, [
    tablesInfo,
    fetchTabularLayout,
  ])

  const fetchMoreData = useCallback(async () => {
    const tablesConfig = getRequestConfig(tablesToFetch)

    fetchTabularLayout(tablesConfig)
  }, [fetchTabularLayout, tablesToFetch])

  return (
    <Wrapper>
      {
        Object.values(tables).map(({ data, schema }, idx) => (
          <TableField
            key={idx}
            initialData={data}
            schema={schema}
            sheetIndex={activeSheetIndex}
          />
        ))
      }
      { isFetching && <Spin.Centered spinning /> }
      {
        !isFetching && !!tablesToFetch.length && (
          <Button
            icon={<ArrowRotateLeftIcon />}
            onClick={fetchMoreData}
          >
            {localize(Localization.LOAD_MORE)}
          </Button>
        )
      }
    </Wrapper>
  )
}

ParsedTables.propTypes = {
  tablesInfo: PropTypes.arrayOf(tableInfoShape).isRequired,
  activeSheetId: PropTypes.string.isRequired,
  sheetsInfo: PropTypes.arrayOf(sheetInfoShape).isRequired,
}

export {
  ParsedTables,
}
