
import PropTypes from 'prop-types'
import { Spin } from '@/components/Spin'
import { useFetchDocumentLayout } from '@/containers/PrototypeReferenceLayout/useFetchDocumentLayout'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { KeyValueItem } from '../KeyValueItem'

const BatchedKeyValuePairs = ({
  layoutId,
  batchIndex,
  checkIsKeyAssigned,
}) => {
  const {
    isLoading,
    documentLayout,
  } = useFetchDocumentLayout({
    layoutId,
    features: [KnownParsingFeature.KEY_VALUE_PAIRS],
    batchIndex,
  })

  const keyValuePairs = documentLayout?.pages.flatMap(({ keyValuePairs }) => keyValuePairs)

  if (isLoading) {
    return <Spin spinning />
  }

  return keyValuePairs?.map((item) => (
    <KeyValueItem
      key={item.id}
      checkIsKeyAssigned={checkIsKeyAssigned}
      item={item}
    />
  ))
}

BatchedKeyValuePairs.propTypes = {
  layoutId: PropTypes.string.isRequired,
  batchIndex: PropTypes.number.isRequired,
  checkIsKeyAssigned: PropTypes.func.isRequired,
}

export {
  BatchedKeyValuePairs,
}
