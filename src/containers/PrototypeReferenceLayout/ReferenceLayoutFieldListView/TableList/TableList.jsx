
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NoData } from '@/components/NoData'
import { Spin } from '@/components/Spin'
import { InView } from '@/containers/InView'
import { useFetchDocumentLayout } from '@/containers/PrototypeReferenceLayout/useFetchDocumentLayout'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import { TableItem } from './TableItem'

const INITIAL_BATCH_INDEX = 0

const TableList = ({ isEditMode }) => {
  const [loadedTables, setLoadedTables] = useState([])
  const [currentBatchIndex, setCurrentBatchIndex] = useState(INITIAL_BATCH_INDEX)

  const activeLayoutId = useSelector(activeLayoutIdSelector)

  useEffect(() => {
    if (activeLayoutId) {
      setLoadedTables([])
      setCurrentBatchIndex(INITIAL_BATCH_INDEX)
    }
  }, [activeLayoutId])

  const {
    isLoading,
    documentLayout: documentLayoutBatch,
    pagesCount,
  } = useFetchDocumentLayout({
    layoutId: activeLayoutId,
    features: [KnownParsingFeature.TABLES],
    batchIndex: currentBatchIndex,
  })

  useEffect(() => {
    if (!documentLayoutBatch || isLoading) {
      return
    }

    const newTables = documentLayoutBatch.pages.flatMap(({ tables }) => tables)

    setLoadedTables((prevData) => [...prevData, ...newTables])

    if (currentBatchIndex < pagesCount - 1) {
      setCurrentBatchIndex((prev) => prev + 1)
    }
  }, [
    isLoading,
    documentLayoutBatch,
    currentBatchIndex,
    pagesCount,
  ])

  if (!loadedTables.length && isLoading) {
    return <Spin.Centered spinning />
  }

  if (!loadedTables.length && pagesCount === 1) {
    return <NoData />
  }

  return (
    loadedTables.map((table, i) => (
      <InView key={i}>
        <TableItem
          isEditMode={isEditMode}
          table={table}
        />
      </InView>
    ))
  )
}

TableList.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
}

export {
  TableList,
}
