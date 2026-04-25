
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { Localization, localize } from '@/localization/i18n'
import { ReferenceLayoutUploader } from '../ReferenceLayoutUploader'
import {
  Wrapper,
  Image,
  ContentWrapper,
  Title,
  Button,
} from './EmptyReferenceLayout.styles'

const EmptyReferenceLayout = ({
  addLayout,
  isUploadAvailable,
}) => {
  const renderTrigger = () => (
    <Button
      type={ButtonType.PRIMARY}
    >
      <NewPlusIcon />
      {localize(Localization.ADD_NEW)}
    </Button>
  )

  return (
    <Wrapper>
      <Image />
      <ContentWrapper>
        <Title>
          {localize(Localization.EMPTY_SECTION_DISCLAIMER)}
        </Title>
        {
          isUploadAvailable && (
            <ReferenceLayoutUploader
              onFilesSelected={addLayout}
              renderUploadTrigger={renderTrigger}
            />
          )
        }
      </ContentWrapper>
    </Wrapper>
  )
}

EmptyReferenceLayout.propTypes = {
  addLayout: PropTypes.func.isRequired,
  isUploadAvailable: PropTypes.bool.isRequired,
}

export {
  EmptyReferenceLayout,
}
