
import PropTypes from 'prop-types'
import {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useSelector } from 'react-redux'
import { documentsApi } from '@/api/documentsApi'
import { Spin } from '@/components/Spin'
import { DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import { InView } from '@/containers/InView'
import { DocumentState } from '@/enums/DocumentState'
import { localize, Localization } from '@/localization/i18n'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { theme } from '@/theme/theme.default'
import { notifyWarning } from '@/utils/notification'
import { DocumentTypeByStateCard } from './DocumentTypeByStateCard'
import { Drawer, Title } from './DocumentTypesByStateDrawer.styles'

const DocumentTypesByStateDrawer = ({
  activeState,
  closeDrawer,
}) => {
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const documentTypes = useSelector(documentTypesSelector)

  const getDocumentsQuantityByStates = useCallback(async () => {
    try {
      setIsLoading(true)

      const { meta } = await documentsApi.getDocuments({
        [DocumentFilterKeys.STATES]: activeState?.states,
        [PaginationKeys.PER_PAGE]: 1,
      })

      setTotalQuantity(meta.total)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsLoading(false)
    }
  }, [activeState?.states])

  useEffect(() => {
    activeState && getDocumentsQuantityByStates()
  }, [activeState, getDocumentsQuantityByStates])

  const DrawerTitle = useMemo(() => (
    <Title>
      {activeState?.name}
    </Title>
  ), [activeState?.name])

  const DrawerContent = useMemo(() => {
    if (isLoading) {
      return (
        <Spin spinning />
      )
    }

    return (
      documentTypes?.map((documentType) => (
        <InView
          key={documentType.code}
          id={documentType.code}
        >
          <DocumentTypeByStateCard
            documentType={documentType}
            limitValue={totalQuantity}
            states={activeState?.states}
          />
        </InView>
      ))
    )
  }, [
    activeState?.states,
    documentTypes,
    isLoading,
    totalQuantity,
  ])

  return (
    <Drawer
      destroyOnClose={true}
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={!!activeState}
      title={DrawerTitle}
      width={theme.size.drawerWidth}
    >
      {DrawerContent}
    </Drawer>
  )
}

DocumentTypesByStateDrawer.propTypes = {
  activeState: PropTypes.shape({
    name: PropTypes.string.isRequired,
    states: PropTypes.arrayOf(
      PropTypes.oneOf(
        Object.values(DocumentState),
      ),
    ),
  }),
  closeDrawer: PropTypes.func.isRequired,
}

export {
  DocumentTypesByStateDrawer,
}
