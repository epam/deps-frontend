
import PropTypes from 'prop-types'
import { useCreateOrUpdateSupplementsMutation } from '@/apiRTK/documentSupplementsApi'
import {
  FieldLabel,
  ContentWrapper,
  InfoWrapper,
  FieldWrapper,
  TextAreaField,
  TextAreaIconsWrapper as IconWrapper,
} from '@/containers/DocumentField'
import { useExpandableText } from '@/hooks/useExpandableText'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement, documentSupplementShape } from '@/models/DocumentSupplement'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { notifyWarning } from '@/utils/notification'
import { FieldInputWrapper } from './EnrichmentField.styles'
import { MoreActions } from './MoreActions'

const EnrichmentField = ({
  disabled,
  documentId,
  documentTypeCode,
  documentSupplements,
  extraField,
  supplement,
}) => {
  const [createOrUpdateSupplements] = useCreateOrUpdateSupplementsMutation()

  const {
    ExpandableContainer,
    ToggleExpandIcon,
  } = useExpandableText()

  const fieldName = extraField?.name ?? supplement?.name
  const fieldCode = supplement?.code || extraField?.code
  const fieldType = supplement?.type || extraField?.type

  const onChange = async (value) => {
    try {
      const modifiedField = new DocumentSupplement({
        type: fieldType,
        code: fieldCode,
        value,
        name: fieldName,
      })

      const data = [
        ...documentSupplements.filter((f) => f.code !== modifiedField.code),
        modifiedField,
      ]
      const documentTypeId = documentTypeCode === UNKNOWN_DOCUMENT_TYPE.code ? null : documentTypeCode

      await createOrUpdateSupplements({
        documentId,
        documentTypeId,
        data,
      }).unwrap()
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }

  return (
    <FieldWrapper>
      <InfoWrapper>
        <FieldLabel
          name={fieldName}
        />
      </InfoWrapper>
      <ContentWrapper>
        <FieldInputWrapper
          disabled={disabled}
        >
          <ExpandableContainer>
            <TextAreaField
              disabled={extraField?.autoFilled || disabled}
              fieldType={fieldType}
              onChange={onChange}
              value={supplement?.value}
            />
          </ExpandableContainer>
          <IconWrapper>
            <ToggleExpandIcon />
          </IconWrapper>
        </FieldInputWrapper>
        <MoreActions
          disabled={disabled}
          documentId={documentId}
          documentSupplements={documentSupplements}
          documentTypeCode={documentTypeCode}
          extraField={extraField}
          supplement={supplement}
        />
      </ContentWrapper>
    </FieldWrapper>
  )
}

EnrichmentField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  documentId: PropTypes.string.isRequired,
  documentTypeCode: PropTypes.string.isRequired,
  documentSupplements: PropTypes.arrayOf(
    documentSupplementShape,
  ).isRequired,
  extraField: documentTypeExtraFieldShape,
  supplement: documentSupplementShape,
}

export {
  EnrichmentField,
}
