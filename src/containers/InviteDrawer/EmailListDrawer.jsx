import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import {
  StyledDescription,
  StyledTextArea,
  Drawer,
  ControlWrapper,
} from './EmailListDrawer.styles'
import { StyledTitle } from './InviteDrawer.styles'

const EmailListDrawer = ({ closeDrawer, visible, addContent }) => {
  const [content, setContent] = useState('')

  const submitEmailList = () => {
    addContent(content)
    setContent('')
    closeDrawer()
  }

  const deleteAllEmailsFromList = () => {
    setContent('')
  }

  const Footer = (
    <ControlWrapper>
      <Button
        onClick={deleteAllEmailsFromList}
        type={ButtonType.LINK}
      >
        {localize(Localization.CLEAR_ALL)}
      </Button>
      <Button
        onClick={submitEmailList}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.ADD_EMAILS)}
      </Button>
    </ControlWrapper>
  )

  return (
    <Drawer
      footer={Footer}
      getContainer={document.body}
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={visible}
      placement={Placement.RIGHT}
      title={<StyledTitle>{localize(Localization.EMAIL_LIST)}</StyledTitle>}
    >
      <StyledDescription>
        {localize(Localization.COPY_OR_WRITE_LIST_EMAILS)}
      </StyledDescription>
      <StyledTextArea
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
    </Drawer>
  )
}

EmailListDrawer.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  addContent: PropTypes.func.isRequired,
}

export { EmailListDrawer }
