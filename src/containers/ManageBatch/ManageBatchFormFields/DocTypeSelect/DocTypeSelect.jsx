
import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { CustomSelect } from '@/components/Select'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'

export const DocTypeSelect = (props) => {
  const areDocumentTypesFetching = useSelector(areTypesFetchingSelector)
  const documentTypes = useSelector(documentTypesSelector)

  const dispatch = useDispatch()

  const group = useWatch({ name: FIELD_FORM_CODE.GROUP })

  const documentTypesOptions = useMemo(() => {
    const typesToDisplay = group
      ? documentTypes?.filter(({ code }) => group.documentTypeIds.includes(code))
      : documentTypes

    return typesToDisplay.map(DocumentType.toOption)
  }, [documentTypes, group])

  useEffect(() => {
    !documentTypes?.length && dispatch(fetchDocumentTypes())
  }, [dispatch, documentTypes?.length])

  return (
    <CustomSelect
      allowClear
      allowSearch
      disabled={areDocumentTypesFetching || !documentTypesOptions?.length}
      fetching={areDocumentTypesFetching}
      options={documentTypesOptions}
      placeholder={localize(Localization.SELECT_DOCUMENT_TYPE)}
      {...props}
    />
  )
}

DocTypeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
}
