
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
} from 'react'
import { useDispatch } from 'react-redux'
import { removeLabel } from '@/actions/documents'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { LongTagsList } from '@/containers/LongTagsList'
import { localize, Localization } from '@/localization/i18n'
import { labelShape } from '@/models/Label'
import { Tag } from '@/models/Tag'
import { notifySuccess } from '@/utils/notification'

const LongLabelsList = ({
  labels,
  documentId,
  className,
  offset = 0,
}) => {
  const dispatch = useDispatch()

  const onLabelClose = useCallback(async (label) => {
    try {
      await dispatch(removeLabel(label.id, documentId))
      notifySuccess(localize(Localization.REMOVE_LABEL_SUCCESSFUL))
    } catch (e) {
      console.error(e)
    }
  }, [
    dispatch,
    documentId,
  ])

  const onClick = (e) => {
    e.stopPropagation()
  }

  const labelsList = useMemo(() => labels.map((label) =>
    new Tag({
      id: label._id,
      text: label.name,
    }),
  ), [labels])

  return (
    <LongTagsList
      className={className}
      icon={<LayerGroupIcon />}
      isTagClosable={true}
      offset={offset}
      onTagClick={onClick}
      onTagClose={onLabelClose}
      tags={labelsList}
    />
  )
}

LongLabelsList.propTypes = {
  labels: PropTypes.arrayOf(labelShape).isRequired,
  documentId: PropTypes.string.isRequired,
  className: PropTypes.string,
  offset: PropTypes.number,
}

export {
  LongLabelsList,
}
