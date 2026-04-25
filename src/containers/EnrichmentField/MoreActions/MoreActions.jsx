
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { documentSupplementShape } from '@/models/DocumentSupplement'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { DeleteFieldButton } from '../DeleteFieldButton'

const MoreActions = ({
  disabled,
  documentId,
  documentSupplements,
  documentTypeCode,
  extraField,
  supplement,
}) => {
  const actions = useMemo(() => [
    {
      content: () => (
        <DeleteFieldButton
          disabled={disabled}
          documentId={documentId}
          documentSupplements={documentSupplements}
          documentTypeCode={documentTypeCode}
          isDocumentTypeField={!!extraField}
          supplement={supplement}
        />
      ),
    },
  ], [
    disabled,
    documentId,
    documentSupplements,
    documentTypeCode,
    extraField,
    supplement,
  ])

  return (
    <ActionsMenu
      disabled={disabled}
      items={actions}
    />
  )
}

MoreActions.propTypes = {
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
  MoreActions,
}
