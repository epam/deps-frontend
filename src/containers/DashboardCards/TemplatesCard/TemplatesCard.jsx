
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
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

const TemplatesCard = ({
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
        [DocumentTypeFilterKey.EXTRACTION_TYPE]: EXTRACTION_TYPE_FILTER_KEY.templates,
      },
    })),
  )

  return (
    <Spin spinning={isFetching}>
      <Card
        count={count}
        icon={<LayerGroupIcon />}
        onClick={onClick}
        title={localize(Localization.TEMPLATES_TITLE)}
      />
    </Spin>
  )
}

export {
  TemplatesCard,
}

TemplatesCard.propTypes = {
  count: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
}
