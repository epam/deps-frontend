
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { DualToggle } from '@/components/DualToggle'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { LongText } from '@/components/LongText'
import { RadioOption } from '@/components/Radio/RadioOption'
import { Localization, localize } from '@/localization/i18n'
import { referenceLayoutShape } from '@/models/ReferenceLayout'
import { ReferenceLayoutUploader } from '../ReferenceLayoutUploader'
import { ReferenceLayoutViewType } from '../ReferenceLayoutViewType'
import { LayoutsListDropdown } from './LayoutsListDropdown'
import {
  Header,
  Title,
  HeaderCell,
  AddLayoutButton,
  KeyValueViewIcon,
  DocumentViewIcon,
} from './ReferenceLayoutHeader.styles'

const RadioOptions = [
  new RadioOption({
    value: ReferenceLayoutViewType.FIELD_LIST,
    icon: <KeyValueViewIcon />,

  }),
  new RadioOption({
    value: ReferenceLayoutViewType.DOCUMENT,
    icon: <DocumentViewIcon />,
  }),
]

const ReferenceLayoutHeader = ({
  addLayout,
  isEditMode,
  layout,
  layoutsList,
  onViewChange,
  removeLayout,
  viewType,
}) => {
  if (!layout) {
    return (
      <Header>
        <Title>
          {localize(Localization.REFERENCE_LAYOUTS)}
        </Title>
      </Header>
    )
  }

  const renderUploadTrigger = () => (
    <AddLayoutButton
      type={ButtonType.GHOST}
    >
      <PlusFilledIcon />
      {localize(Localization.ADD_REFERENCE_LAYOUT)}
    </AddLayoutButton>
  )

  return (
    <Header>
      <HeaderCell>
        <LayoutsListDropdown
          layoutsList={layoutsList}
          removeLayout={removeLayout}
        />
        <Title>
          <LongText
            text={layout.title}
          />
        </Title>
      </HeaderCell>
      <HeaderCell>
        {
          isEditMode && (
            <ReferenceLayoutUploader
              onFilesSelected={addLayout}
              renderUploadTrigger={renderUploadTrigger}
            />
          )
        }
        <DualToggle
          onChange={onViewChange}
          options={RadioOptions}
          value={viewType}
        />
      </HeaderCell>
    </Header>
  )
}

ReferenceLayoutHeader.propTypes = {
  addLayout: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  layout: referenceLayoutShape,
  layoutsList: PropTypes.arrayOf(referenceLayoutShape),
  onViewChange: PropTypes.func.isRequired,
  removeLayout: PropTypes.func.isRequired,
  viewType: PropTypes.oneOf(
    Object.values(ReferenceLayoutViewType),
  ).isRequired,
}

export {
  ReferenceLayoutHeader,
}
