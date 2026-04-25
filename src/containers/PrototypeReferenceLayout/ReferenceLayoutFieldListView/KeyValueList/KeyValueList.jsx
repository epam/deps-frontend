
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { NoData } from '@/components/NoData'
import { Spin } from '@/components/Spin'
import { useFetchDocumentLayout } from '@/containers/PrototypeReferenceLayout/useFetchDocumentLayout'
import { KnownParsingFeature } from '@/enums/KnownParsingFeature'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import { BatchedKeyValuePairs } from './BatchedKeyValuePairs'
import { StyledInView, FullHeightWrapper } from './KeyValueList.styles'

const KeyValueList = ({
  prototypeMappingKeys,
}) => {
  const activeLayoutId = useSelector(activeLayoutIdSelector)

  const {
    isLoading,
    documentLayout,
    pagesCount,
  } = useFetchDocumentLayout({
    layoutId: activeLayoutId,
    features: [KnownParsingFeature.KEY_VALUE_PAIRS],
  })

  const checkIsKeyAssigned = (key) => (
    prototypeMappingKeys?.some((mappingKey) => mappingKey === key)
  )

  const keyValuePairs = useMemo(() => (
    documentLayout?.pages.flatMap(({ keyValuePairs }) => keyValuePairs)
  ), [documentLayout])

  if (isLoading) {
    return <Spin.Centered spinning />
  }

  if (
    !documentLayout ||
    (!keyValuePairs?.length && pagesCount === 1)
  ) {
    return <NoData />
  }

  const batchesToIterate = Array(Number(pagesCount)).fill(0)

  return (
    <FullHeightWrapper>
      {
        batchesToIterate.map((_, i) => (
          <StyledInView key={i}>
            <BatchedKeyValuePairs
              batchIndex={i}
              checkIsKeyAssigned={checkIsKeyAssigned}
              layoutId={activeLayoutId}
            />
          </StyledInView>
        ))
      }
    </FullHeightWrapper>
  )
}

KeyValueList.propTypes = {
  prototypeMappingKeys: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ),
}

export {
  KeyValueList,
}
