
import PropTypes from 'prop-types'
import { Flag } from '@/components/Flag'
import { FlagProps } from '@/components/Flag/FlagProps'
import { FlagType } from '@/components/Flag/FlagType'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'

const ModifiedByFlag = ({ modifiedBy }) => {
  if (!modifiedBy) {
    return null
  }

  return (
    <Flag {
      ...new FlagProps(
        localize(Localization.MODIFIED_FLAG),
        FlagType.INFO,
        localize(Localization.MODIFIED_BY, { user: `${modifiedBy}` }),
        Placement.TOP,
      )
    }
    />
  )
}

ModifiedByFlag.propTypes = {
  modifiedBy: PropTypes.string,
}

export { ModifiedByFlag }
