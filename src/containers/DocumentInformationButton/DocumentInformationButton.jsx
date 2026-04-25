
import { useCallback, useState } from 'react'
import { Button } from '@/components/Button'
import { InfoIcon } from '@/components/Icons/InfoIcon'
import { DocumentInformation } from '@/containers/DocumentInformation'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { TitleDrawer, Wrapper, Drawer } from './DocumentInformationButton.styles'

const DocumentInformationButton = () => {
  const [visible, setVisible] = useState(false)

  const onTriggerButtonClick = useCallback(() => {
    setVisible(true)
  }, [])

  const getContainer = useCallback(() => document.body, [])

  const onClose = useCallback(() => {
    setVisible(false)
  }, [])

  const renderInformationButton = () => (
    <Button.Text
      onClick={onTriggerButtonClick}
    >
      {localize(Localization.DOCUMENT_INFORMATION)}
    </Button.Text>
  )

  const renderTitleDrawer = () => (
    <TitleDrawer>
      <InfoIcon />
      {localize(Localization.DOCUMENT_INFORMATION)}
    </TitleDrawer>
  )

  const renderDrawer = () => (
    <Drawer
      getContainer={getContainer}
      hasCloseIcon={false}
      onClose={onClose}
      open={visible}
      placement={Placement.RIGHT}
      title={renderTitleDrawer()}
      width={theme.size.drawerWidth}
    >
      {visible && <DocumentInformation />}
    </Drawer>
  )

  return (
    <Wrapper>
      {renderInformationButton()}
      {renderDrawer()}
    </Wrapper>
  )
}

export {
  DocumentInformationButton,
}
