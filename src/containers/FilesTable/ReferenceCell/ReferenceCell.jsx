
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { LongText } from '@/components/LongText'
import { FileReferenceType, REFERENCE_TYPE_LOCALIZATION } from '@/enums/FileReferenceType'
import { fileReferenceShape } from '@/models/File'
import { navigationMap } from '@/utils/navigationMap'
import {
  ReferenceContainer,
  RefName,
  RefType,
} from './ReferenceCell.styles'

export const REFERENCE_TYPE_NAVIGATION = {
  [FileReferenceType.BATCH]: (id) => navigationMap.batches.batch(id),
  [FileReferenceType.DOCUMENT]: (id) => navigationMap.documents.document(id),
}

export const ReferenceCell = ({ reference }) => {
  const dispatch = useDispatch()

  const handleClick = (e) => {
    e.stopPropagation()
    const navigationPath = REFERENCE_TYPE_NAVIGATION[reference.entityType](reference.entityId)
    dispatch(goTo(navigationPath))
  }

  return (
    <ReferenceContainer>
      <RefName onClick={handleClick}>
        <LongText text={reference.entityName} />
      </RefName>
      <RefType>{REFERENCE_TYPE_LOCALIZATION[reference.entityType]}</RefType>
    </ReferenceContainer>
  )
}

ReferenceCell.propTypes = {
  reference: fileReferenceShape.isRequired,
}
