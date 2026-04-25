
import PropTypes from 'prop-types'
import { ExternalLinkAltIcon } from '@/components/Icons/ExternalLinkAlt'
import { Localization, localize } from '@/localization/i18n'
import { Button } from './GoToAzureButton.styles'

const AZURE_STUDIO_LINK = 'https://documentintelligence.ai.azure.com/studio'

const GoToAzureButton = ({
  text,
}) => {
  const onClick = () => {
    window.open(AZURE_STUDIO_LINK, '_blank')
  }

  return (
    <Button onClick={onClick}>
      {text || localize(Localization.AZURE_STUDIO)}
      <ExternalLinkAltIcon />
    </Button>
  )
}

export {
  GoToAzureButton,
}

GoToAzureButton.propTypes = {
  text: PropTypes.string,
}
