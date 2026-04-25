
import { Tag } from '@/components/Tag'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'

const DisplayModeCell = ({
  field,
}) => {
  if (field.readOnly && !field.confidential) {
    return (
      <Tag closable={false}>
        {localize(Localization.READ_ONLY_MODE)}
      </Tag>
    )
  }

  if (field.confidential) {
    return (
      <Tag closable={false}>
        {localize(Localization.MASK_MODE)}
      </Tag>
    )
  }

  return null
}

DisplayModeCell.propTypes = {
  field: documentTypeFieldShape,
}

export {
  DisplayModeCell,
}
