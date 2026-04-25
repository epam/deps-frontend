
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DOCUMENT_LAYOUT_TYPE } from '@/enums/DocumentLayoutType'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { referenceLayoutShape } from '@/models/ReferenceLayout'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import { apiMap } from '@/utils/apiMap'
import { useFetchDocumentLayout } from '../useFetchDocumentLayout'
import { ColorHint } from './ColorHint'
import { KeyValuePairsViewer } from './KeyValuePairsViewer'
import { Pagination, SpinWrapper } from './ReferenceLayoutDocumentView.styles'
import { TablesViewer } from './TablesViewer'

const INITIAL_ACTIVE_PAGE = 1
const INITIAL_SCALE_FACTOR = 1
const PAGE_SIZE = 1

const getPreviewUrls = (unifiedData) => (
  Object.values(unifiedData).reduce((acc, ud) => {
    const blobUnifiedData = ud.filter((d) => !!d.blobName)
    const { blobName } = blobUnifiedData[blobUnifiedData.length - 1]
    return [...acc, apiMap.apiGatewayV2.v5.file.blob(blobName)]
  }, [])
)

const FIELDS_VIEW_TYPE_TO_PARSING_FEATURE = {
  [PrototypeViewType.FIELDS]: KnownParsingFeature.KEY_VALUE_PAIRS,
  [PrototypeViewType.TABLES]: KnownParsingFeature.TABLES,
}

const extractFromDocumentLayout = (type, documentLayout) =>
  documentLayout?.pages.flatMap((page) => page[type])

const ReferenceLayoutDocumentView = ({
  isEditMode,
  fieldsViewType,
  prototypeMappingKeys,
  referenceLayout,
}) => {
  const [activePage, setActivePage] = useState(INITIAL_ACTIVE_PAGE)
  const [scaleFactor, setScaleFactor] = useState(INITIAL_SCALE_FACTOR)

  const activeLayoutId = useSelector(activeLayoutIdSelector)

  const {
    isLoading,
    documentLayout,
  } = useFetchDocumentLayout({
    layoutId: referenceLayout.id,
    features: [FIELDS_VIEW_TYPE_TO_PARSING_FEATURE[fieldsViewType]],
    batchIndex: activePage - 1,
  })

  useEffect(() => {
    if (activeLayoutId) {
      setScaleFactor(INITIAL_SCALE_FACTOR)
      setActivePage(INITIAL_ACTIVE_PAGE)
    }
  }, [activeLayoutId])

  const onPageChange = (page) => {
    setActivePage(page)
  }

  const previewUrls = getPreviewUrls(referenceLayout.unifiedData)

  const checkIsKeyAssigned = (key) => (
    prototypeMappingKeys?.some((mappingKey) => mappingKey === key)
  )

  const keyValuePairs = extractFromDocumentLayout(DOCUMENT_LAYOUT_TYPE.KEY_VALUE_PAIRS, documentLayout)
  const tables = extractFromDocumentLayout(DOCUMENT_LAYOUT_TYPE.TABLES, documentLayout)
  const showColorHint = !!keyValuePairs?.length || !!tables?.length

  return (
    <>
      {showColorHint && <ColorHint />}
      <SpinWrapper spinning={isLoading}>
        {
          fieldsViewType === PrototypeViewType.FIELDS ? (
            <KeyValuePairsViewer
              checkIsKeyAssigned={checkIsKeyAssigned}
              imageUrl={previewUrls[activePage - 1]}
              isEditMode={isEditMode}
              keyValuePairs={keyValuePairs}
              onScaleChange={setScaleFactor}
              scaleFactor={scaleFactor}
            />
          ) : (
            <TablesViewer
              imageUrl={previewUrls[activePage - 1]}
              isEditMode={isEditMode}
              onScaleChange={setScaleFactor}
              scaleFactor={scaleFactor}
              tables={tables}
            />
          )
        }
      </SpinWrapper>
      <Pagination
        current={activePage}
        onChange={onPageChange}
        pageSize={PAGE_SIZE}
        showSizeChanger={false}
        total={previewUrls.length}
      />
    </>
  )
}

ReferenceLayoutDocumentView.propTypes = {
  fieldsViewType: PropTypes.oneOf(
    Object.values(PrototypeViewType),
  ).isRequired,
  referenceLayout: referenceLayoutShape,
  isEditMode: PropTypes.bool.isRequired,
  prototypeMappingKeys: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ),
}

export {
  ReferenceLayoutDocumentView,
}
