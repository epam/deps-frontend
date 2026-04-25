
import PropTypes from 'prop-types'
import { Modal } from '@/components/Modal'
import { Spin } from '@/components/Spin'
import { Localization, localize } from '@/localization/i18n'
import {
  Content,
  Wrapper,
} from './NotificationModal.styles'

export const NotificationModal = ({ setIsVisible }) => {
  const onCancelHandler = () => {
    setIsVisible(false)
  }

  return (
    <Modal
      centered
      closable
      destroyOnClose
      footer={null}
      maskClosable
      onCancel={onCancelHandler}
      open
      title={localize(Localization.SPLITTING)}
    >
      <Wrapper>
        <Spin.Centered spinning />
        <Content>
          {localize(Localization.SPLITTING_IN_PROGRESS)}
        </Content>
      </Wrapper>
    </Modal>
  )
}

NotificationModal.propTypes = {
  setIsVisible: PropTypes.func.isRequired,
}
