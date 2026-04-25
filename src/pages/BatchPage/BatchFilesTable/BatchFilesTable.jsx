
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { setSelection } from '@/actions/navigation'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { Table } from '@/components/Table'
import { withParentSize } from '@/hocs/withParentSize'
import { useEventSource, KnownBusinessEvent } from '@/hooks/useEventSource'
import { useQueryParams } from '@/hooks/useQueryParams'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { selectionSelector } from '@/selectors/navigation'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { openInNewTarget } from '@/utils/window'
import { BatchFilesFilterConfig } from './BatchFilesFilterConfig'
import { ColumnCode } from './ColumnCode'
import {
  generateFileNameColumn,
  generateFileStatusColumn,
  generateFileEngineColumn,
  generateFileDocTypeColumn,
  generateFileParsingFeaturesColumn,
  generateFileLLMColumn,
  generateBatchFileActionsColumn,
} from './columns'

const CHECKBOX_CLASS_NAME = 'ant-checkbox-wrapper'

const SizeAwareTable = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Table
    {...props}
    height={props.size.height}
  />
))

const getTableColumns = (filterConfig) => [
  generateFileNameColumn(filterConfig),
  generateFileStatusColumn(filterConfig),
  generateFileEngineColumn(filterConfig),
  generateFileDocTypeColumn(filterConfig),
  generateFileLLMColumn(filterConfig),
  generateFileParsingFeaturesColumn(filterConfig),
  generateBatchFileActionsColumn(),
]

export const BatchFilesTable = () => {
  const dispatch = useDispatch()
  const addEvent = useEventSource('BatchFilesTable')

  const documentTypes = useSelector(documentTypesSelector)

  const { id } = useParams()

  const {
    data: batch,
    isFetching,
  } = useFetchBatchQuery(id)

  const [batchFiles, setBatchFiles] = useState(batch.files || [])

  const {
    queryParams,
    setQueryParams,
  } = useQueryParams()

  const filterConfig = useMemo(() => new BatchFilesFilterConfig(queryParams), [queryParams])

  const filterHandler = useCallback((pagination, filters, sorter) => {
    const filterConfig = new BatchFilesFilterConfig({
      ...filters,
      sortField: sorter.column?.key,
      sortDirect: sorter.order,
    })

    setQueryParams(filterConfig)
  }, [setQueryParams])

  const selectedRowKeys = useSelector(selectionSelector)

  const onSelectChange = useCallback((newSelectedRowKeys) => {
    dispatch(setSelection(newSelectedRowKeys))
  }, [dispatch])

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: onSelectChange,
  }), [selectedRowKeys, onSelectChange])

  const filterByName = useCallback((entry) => (
    !filterConfig[ColumnCode.NAME] ||
    entry.name.toLowerCase().includes(filterConfig[ColumnCode.NAME].toLowerCase())
  ), [filterConfig])

  const filterByStatus = useCallback((entry) => (
    !filterConfig[ColumnCode.STATUS].length ||
    filterConfig[ColumnCode.STATUS].includes(entry.status)
  ), [filterConfig])

  const filterByEngine = useCallback((entry) => (
    !filterConfig[ColumnCode.ENGINE].length ||
    (entry.engine && filterConfig[ColumnCode.ENGINE].some((engine) => entry.engine === engine))
  ), [filterConfig])

  const filterByDocType = useCallback((entry) => {
    const dtName = documentTypes.find((docType) => docType.id === entry?.documentTypeId)?.name.toLowerCase()
    return (
      !filterConfig[ColumnCode.DOC_TYPE] ||
      filterConfig[ColumnCode.DOC_TYPE].toLowerCase().includes(dtName) ||
      dtName?.includes(filterConfig[ColumnCode.DOC_TYPE].toLowerCase())
    )
  }, [filterConfig, documentTypes])

  const filterByParsingFeatures = useCallback((entry) => (
    !filterConfig[ColumnCode.PARSING_FEATURES].length ||
    (entry.parsingFeatures && filterConfig[ColumnCode.PARSING_FEATURES].some((feature) => entry.parsingFeatures.includes(feature))
    )
  ), [filterConfig])

  const filterByLlmType = useCallback((entry) => (
    !filterConfig[ColumnCode.LLM_TYPE] ||
    entry.llmType?.includes(filterConfig[ColumnCode.LLM_TYPE]) ||
    filterConfig[ColumnCode.LLM_TYPE].includes(entry.llmType)
  ), [filterConfig])

  const rowKey = (record) => record.id

  const filteredData = useMemo(() => (
    batchFiles
      .filter(filterByName)
      .filter(filterByEngine)
      .filter(filterByStatus)
      .filter(filterByDocType)
      .filter(filterByParsingFeatures)
      .filter(filterByLlmType)
  ), [
    batchFiles,
    filterByDocType,
    filterByEngine,
    filterByLlmType,
    filterByName,
    filterByParsingFeatures,
    filterByStatus,
  ])

  const onRowProps = ({ documentId }) => ({
    onClick: (event) => {
      if (!documentId) {
        return
      }

      const url = navigationMap.documents.document(documentId)

      !event.target.classList.contains(CHECKBOX_CLASS_NAME) &&
        openInNewTarget(
          event,
          url,
          () => goTo(url),
        )
    },
  })

  const onFileStatusUpdated = useCallback((eventData) => {
    const updatedFileId = eventData.fileId
    const updatedStatus = eventData.status

    const isFileVisible = batchFiles.some((file) => file.id === updatedFileId)

    if (!isFileVisible) {
      return
    }

    setBatchFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) =>
        file.id === updatedFileId
          ? {
            ...file,
            status: updatedStatus,
          }
          : file,
      )
      return updatedFiles
    })
  }, [batchFiles])

  useEffect(() => {
    setBatchFiles(batch.files || [])
  }, [batch.files])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.BATCH_FILE_STATUS_UPDATED, onFileStatusUpdated)
  }, [addEvent, onFileStatusUpdated])

  return (
    <SizeAwareTable
      columns={getTableColumns(filterConfig)}
      data={filteredData}
      fetching={isFetching}
      onFilter={filterHandler}
      onRow={onRowProps}
      pagination={false}
      rowKey={rowKey}
      rowSelection={rowSelection}
    />
  )
}
