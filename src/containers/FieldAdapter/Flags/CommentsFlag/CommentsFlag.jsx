
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Flag } from '@/components/Flag'
import { FlagProps } from '@/components/Flag/FlagProps'
import { FlagType } from '@/components/Flag/FlagType'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { commentShape } from '@/models/Comment'

const CommentsFlag = ({ comments }) => {
  const allComments = useMemo(
    () => comments?.reduce((message, { text }) => message + text + '. ', ''),
    [comments],
  )

  if (!comments?.length) {
    return null
  }

  return (
    <Flag {
      ...new FlagProps(
        localize(Localization.COMMENT_FLAG),
        FlagType.INFO,
        allComments,
        Placement.TOP,
      )
    }
    />
  )
}

CommentsFlag.propTypes = {
  comments: PropTypes.arrayOf(commentShape),
}

export { CommentsFlag }
