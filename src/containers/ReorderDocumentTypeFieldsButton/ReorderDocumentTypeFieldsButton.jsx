
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import { updateExtraFields } from '@/api/enrichmentApi'
import { useUpdateExtractionFieldsMutation } from '@/apiRTK/extractionFieldsApi'
import { Button, ButtonType } from '@/components/Button'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { DocumentTypeField, documentTypeFieldShape } from '@/models/DocumentTypeField'
import { notifyWarning } from '@/utils/notification'
import { FieldsList } from './FieldsList'
import {
  CancelButton,
  DrawerFooterWrapper,
  Drawer,
} from './ReorderDocumentTypeFieldsButton.styles'

const drawerWidth = '90%'

const mapFieldsToOrderDTO = (fields) => (
  fields.map(({ code, name, order }) => ({
    code,
    order,
    name,
  }))
)

const adjustFieldsOrder = (fields) => (
  fields.map((field, index) => ({
    ...field,
    order: index + 1,
  }))
)

const ReorderDocumentTypeFieldsButton = ({
  documentType,
  fields,
}) => {
  const [draggableFields, setDraggableFields] = useState(fields)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const dispatch = useDispatch()

  const refreshData = useCallback(() => {
    dispatch(fetchDocumentType(documentType.code, [
      DocumentTypeExtras.EXTRACTION_FIELDS,
      DocumentTypeExtras.EXTRA_FIELDS,
    ]))
  }, [
    documentType.code,
    dispatch,
  ])

  const [
    updateExtractionFields,
    { isLoading },
  ] = useUpdateExtractionFieldsMutation()

  const areFieldsReordered = fields.some((item, index) => {
    const reorderedIndex = draggableFields.findIndex((reorderedItem) => reorderedItem.code === item.code)
    return reorderedIndex !== index
  })

  const getFieldCategory = useCallback((field) => {
    const isExtractionField = documentType.fields.some(
      (f) => f.code === field.code,
    )

    if (isExtractionField) {
      return DocumentTypeField.getFieldCategory(field.code, documentType.llmExtractors)
    }

    return DocumentTypeFieldCategory.EXTRA
  }, [
    documentType.fields,
    documentType.llmExtractors,
  ])

  const toggleDrawer = useCallback(() => {
    setDraggableFields(adjustFieldsOrder(fields))
    setIsDrawerVisible((prev) => !prev)
  }, [fields])

  const getCategorizedFields = useCallback((fields) => {
    const extractionFields = []
    const extraFields = []

    fields.forEach((field) => {
      const category = getFieldCategory(field)
      if (category === DocumentTypeFieldCategory.EXTRA) {
        extraFields.push(field)
      } else {
        extractionFields.push(field)
      }
    })

    return [extractionFields, extraFields]
  }, [getFieldCategory])

  const updateFields = useCallback(async () => {
    const fields = adjustFieldsOrder(draggableFields)
    const [extractionFields, extraFields] = getCategorizedFields(fields)

    try {
      await Promise.all([
        updateExtractionFields({
          documentTypeCode: documentType.code,
          fields: mapFieldsToOrderDTO(extractionFields),
        }).unwrap(),

        updateExtraFields(
          documentType.code,
          mapFieldsToOrderDTO(extraFields),
        ),
      ])

      refreshData()
      toggleDrawer()
    } catch {
      notifyWarning(localize(Localization.UNABLE_TO_SAVE_FIELD_ORDER))
    }
  }, [
    draggableFields,
    documentType.code,
    getCategorizedFields,
    refreshData,
    toggleDrawer,
    updateExtractionFields,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={toggleDrawer}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={!areFieldsReordered}
        loading={isLoading}
        onClick={updateFields}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    isLoading,
    toggleDrawer,
    updateFields,
    areFieldsReordered,
  ])

  return (
    <>
      <Button.Secondary onClick={toggleDrawer}>
        {localize(Localization.FIELDS_ORDER)}
      </Button.Secondary>
      <Drawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={toggleDrawer}
        open={isDrawerVisible}
        title={localize(Localization.CHANGE_FIELDS_ORDER)}
        width={drawerWidth}
      >
        <FieldsList
          fields={draggableFields}
          getFieldCategory={getFieldCategory}
          setFields={setDraggableFields}
        />
      </Drawer>
    </>
  )
}

ReorderDocumentTypeFieldsButton.propTypes = {
  documentType: documentTypeShape.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.oneOfType([
      documentTypeExtraFieldShape,
      documentTypeFieldShape,
    ]),
  ).isRequired,
}

export {
  ReorderDocumentTypeFieldsButton,
}
