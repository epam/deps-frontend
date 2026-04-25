
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { documentsApi } from '@/api/documentsApi'
import { Spin } from '@/components/Spin'
import { PaginationKeys, DocumentFilterKeys } from '@/constants/navigation'
import { DocumentStatesByTypeDrawer } from '@/containers/DocumentStatesByTypeDrawer'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { stringsSorter } from '@/utils/string'
import { Chart } from './Chart'
import {
  Header,
  StyledPagination,
  Title,
  Wrapper,
} from './DocumentsByTypeChart.styles'

const typesPerPage = 10

const mapTypesToRequest = (types) => types.map(async (type) => documentsApi.getDocuments({
  [PaginationKeys.PAGE]: 1,
  [PaginationKeys.PER_PAGE]: 1,
  [DocumentFilterKeys.TYPES]: [type.code || type.id],
}))

const mapResponseToTypes = (types, response) =>
  types.map(({ documentType, id, code }, index) => ({
    id,
    code,
    documentType,
    count: response[index].meta.total,
  }))

const getTypesByPage = (docTypes, page) => {
  const startIndex = (page - 1) * typesPerPage
  const endIndex = startIndex + typesPerPage
  return docTypes.slice(startIndex, endIndex)
}

const DocumentsByTypeChart = ({ docTypesList, isFetching }) => {
  const [page, setPage] = useState(1)
  const [isPageDataLoading, setIsPageDataLoading] = useState(isFetching)
  const [currentTypes, setCurrentTypes] = useState([])
  const [activeDocumentType, setActiveDocumentType] = useState(null)

  const sortedTypeList = useMemo(
    () => docTypesList.sort(
      (prev, current) => stringsSorter(prev.documentType, current.documentType)),
    [docTypesList],
  )

  const getPageData = useCallback(async () => {
    setIsPageDataLoading(true)
    try {
      const types = getTypesByPage(sortedTypeList, page)
      const response = await Promise.all(mapTypesToRequest(types))
      setCurrentTypes(mapResponseToTypes(types, response))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsPageDataLoading(false)
    }
  }, [page, sortedTypeList])

  useEffect(() => {
    if (isFetching) {
      return
    }
    getPageData()
  }, [getPageData, isFetching])

  const closeDrawer = () => setActiveDocumentType(null)

  const showDrawer = ({ data }) => {
    const { id: activeDocumentTypeId, code: activeDocumentTypeCode } = data
    const documentType = docTypesList.find(({ code, id }) => (
      code ? code === activeDocumentTypeCode : id === activeDocumentTypeId
    ))

    setActiveDocumentType(documentType)
  }

  return (
    <>
      <Wrapper>
        <Header>
          <Title>{localize(Localization.DOCUMENTS_BY_TYPES)}</Title>
          {
            !isPageDataLoading &&
          (
            <StyledPagination
              current={page}
              onChange={
                (page) => {
                  setPage(page)
                }
              }
              pageSize={typesPerPage}
              simple
              total={docTypesList.length}
            />
          )
          }
        </Header>
        {
          isPageDataLoading
            ? <Spin.Centered spinning />
            : (
              <Chart
                data={currentTypes}
                onClick={showDrawer}
              />
            )
        }
      </Wrapper>
      <DocumentStatesByTypeDrawer
        activeDocumentType={activeDocumentType}
        closeDrawer={closeDrawer}
      />
    </>
  )
}

DocumentsByTypeChart.propTypes = {
  docTypesList: PropTypes.arrayOf(PropTypes.shape({
    documentType: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    code: PropTypes.string,
  })),
  isFetching: PropTypes.bool.isRequired,
}

export { DocumentsByTypeChart }
