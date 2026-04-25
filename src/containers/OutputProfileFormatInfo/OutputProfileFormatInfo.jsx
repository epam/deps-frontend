
import { Localization, localize } from '@/localization/i18n'
import { outputProfileShape } from '@/models/OutputProfile'
import {
  FormatBadge,
  Label,
} from './OutputProfileFormatInfo.styles'

const OutputProfileFormatInfo = ({ profile }) => {
  return (
    <>
      <Label>
        {localize(Localization.PROFILE_OUTPUT_FORMAT)}
      </Label>
      <FormatBadge>
        {profile.format}
      </FormatBadge>
    </>
  )
}

OutputProfileFormatInfo.propTypes = {
  profile: outputProfileShape.isRequired,
}

export {
  OutputProfileFormatInfo,
}
