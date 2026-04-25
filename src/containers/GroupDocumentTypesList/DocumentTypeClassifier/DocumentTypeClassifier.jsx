
import PropTypes from 'prop-types'
import { memo } from 'react'
import { genAiClassifierShape } from '@/models/DocumentTypesGroup'
import { AddClassifierDrawerButton } from '../AddClassifierDrawerButton'
import { EditClassifierDrawerButton } from '../EditClassifierDrawerButton'
import { ClassifierTag } from './ClassifierTag'
import { Wrapper } from './DocumentTypeClassifier.styles'

const DocumentTypeClassifier = memo(({
  classifier,
  documentTypeId,
}) => {
  if (!classifier) {
    return (
      <AddClassifierDrawerButton
        documentTypeId={documentTypeId}
      />
    )
  }

  return (
    <Wrapper>
      <ClassifierTag
        classifier={classifier}
      />
      <EditClassifierDrawerButton
        classifier={classifier}
      />
    </Wrapper>
  )
})

DocumentTypeClassifier.propTypes = {
  classifier: genAiClassifierShape,
  documentTypeId: PropTypes.string.isRequired,
}

export {
  DocumentTypeClassifier,
}
