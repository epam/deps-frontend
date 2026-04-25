
import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeFieldsGrouping } from '@/actions/documentReviewPage'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { useCustomization } from '@/hooks/useCustomization'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { documentTypeSelector } from '@/selectors/documentReviewPage'

const useCustomFieldsGrouping = () => {
  const dispatch = useDispatch()
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)
  const documentType = useSelector(documentTypeSelector)

  const url = useMemo(() => (
    customization?.ApplyFieldsGrouping?.getUrl(
      user.organisation.customizationUrl ||
      user.defaultCustomizationUrl,
    )
  ), [customization, user])

  const { module: getCustomFieldsGrouping } = useCustomization(url)

  const groupingConfig = useMemo(() => ({
    possibleGroupTypes: GROUPING_TYPE,
    documentTypeCode: documentType.code,
  }), [documentType])

  useEffect(() => {
    if (!getCustomFieldsGrouping) {
      return
    }

    const fieldsGrouping = getCustomFieldsGrouping(groupingConfig)

    Object.values(GROUPING_TYPE).includes(fieldsGrouping) && dispatch(changeFieldsGrouping(fieldsGrouping))
  }, [
    getCustomFieldsGrouping,
    groupingConfig,
    dispatch,
  ])
}

export {
  useCustomFieldsGrouping,
}
