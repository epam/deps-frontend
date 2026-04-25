
import { useState } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { GreetingLetterIcon } from '@/components/Icons/GreetingLetterIcon'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { Modal, Text, Title } from './GreetingModal.styles'

const GreetingModal = ({ user }) => {
  const [visible, setVisible] = useState(true)

  const modalText = (
    localize(Localization.GREETING_MESSAGE, {
      userName: (
        user.firstName || user.lastName
          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`
          : `${user.email}`
      ),
      orgName: `${user.organisation.name}`,
    })
  )

  const closeModal = () => setVisible(false)

  return (
    <Modal
      footer={
        [
          <Button
            key={localize(Localization.START)}
            onClick={closeModal}
            type={ButtonType.PRIMARY}
          >
            {localize(Localization.START)}
          </Button>,
        ]
      }
      onCancel={closeModal}
      open={visible}
      title={
        (
          <Title>
            {localize(Localization.JOINED_TO_ORGANISATION)}
          </Title>
        )
      }
    >
      <>
        <GreetingLetterIcon />
        {
          <Text>
            {modalText}
          </Text>
        }
      </>
    </Modal>
  )
}

GreetingModal.propTypes = {
  user: userShape.isRequired,
}

export {
  GreetingModal,
}
