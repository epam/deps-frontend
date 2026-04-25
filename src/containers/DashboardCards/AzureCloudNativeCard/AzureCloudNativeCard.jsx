
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { CloudIcon } from '@/components/Icons/CloudIcon'
import { Spin } from '@/components/Spin'
import {
  DocumentTypeFilterKey,
  EXTRACTION_TYPE_FILTER_KEY,
  FILTERS,
} from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { BASE_DOCUMENT_TYPES_FILTER_CONFIG } from '@/models/DocumentTypesFilterConfig'
import { navigationMap } from '@/utils/navigationMap'
import { openInNewTarget } from '@/utils/window'
import { Card } from '../Card'

const AzureCloudNativeCard = ({
  isFetching,
  count,
}) => {
  const dispatch = useDispatch()

  const onClick = (event) => openInNewTarget(
    event,
    navigationMap.documentTypes(),
    () => dispatch(goTo(navigationMap.documentTypes(), {
      [FILTERS]: {
        ...BASE_DOCUMENT_TYPES_FILTER_CONFIG,
        [DocumentTypeFilterKey.EXTRACTION_TYPE]: EXTRACTION_TYPE_FILTER_KEY.azureCloudExtractor,
      },
    })),
  )

  return (
    <Spin spinning={isFetching}>
      <Card
        count={count}
        icon={<CloudIcon />}
        onClick={onClick}
        title={localize(Localization.AZURE_CLOUD_NATIVE)}
      />
    </Spin>
  )
}

export {
  AzureCloudNativeCard,
}

AzureCloudNativeCard.propTypes = {
  count: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
}
