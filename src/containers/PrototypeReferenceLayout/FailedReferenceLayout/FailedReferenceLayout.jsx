
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { ArrowsRotate } from '@/components/Icons/ArrowsRotate'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Image,
  Title,
  Button,
} from './FailedReferenceLayout.styles'

const FailedReferenceLayout = ({ restartLayout }) => (
  <Wrapper>
    <Image />
    <Title>
      {localize(Localization.REFERENCE_LAYOUT_FAILED)}
    </Title>
    <Button
      onClick={restartLayout}
      type={ButtonType.PRIMARY}
    >
      <ArrowsRotate />
      {localize(Localization.RELOAD)}
    </Button>
  </Wrapper>
)

FailedReferenceLayout.propTypes = {
  restartLayout: PropTypes.func.isRequired,
}

export {
  FailedReferenceLayout,
}
