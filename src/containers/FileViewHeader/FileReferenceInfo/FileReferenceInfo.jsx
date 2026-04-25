
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { FileReferenceType, REFERENCE_TYPE_LOCALIZATION } from '@/enums/FileReferenceType'
import { fileReferenceShape } from '@/models/File'
import { navigationMap } from '@/utils/navigationMap'
import {
  ReferenceContainer,
  RefName,
  RefType,
} from './FileReferenceInfo.styles'

export const REFERENCE_TYPE_NAVIGATION = {
  [FileReferenceType.BATCH]: (id) => navigationMap.batches.batch(id),
  [FileReferenceType.DOCUMENT]: (id) => navigationMap.documents.document(id),
}

export const FileReferenceInfo = ({ reference }) => {
  const dispatch = useDispatch()

  const handleClick = () => {
    const navigationPath = REFERENCE_TYPE_NAVIGATION[reference.entityType](reference.entityId)
    dispatch(goTo(navigationPath))
  }

  return (
    <ReferenceContainer onClick={handleClick}>
      <RefName text={reference.entityName} />
      <RefType>{REFERENCE_TYPE_LOCALIZATION[reference.entityType]}</RefType>
    </ReferenceContainer>
  )
}

FileReferenceInfo.propTypes = {
  reference: fileReferenceShape.isRequired,
}
