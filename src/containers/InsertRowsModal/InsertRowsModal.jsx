
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'
import { InputNumber } from './InsertRowsModal.styles'

const MODAL_WIDTH = 0.5

const InsertRowsModal = ({ onOk, title, onCancel, message }) => {
  const [amount, setAmount] = useState(0)

  const onOkHandler = useCallback(
    () => {
      onOk(amount)
    },
    [onOk, amount],
  )

  return (
    <Modal
      okText={localize(Localization.INSERT_ROWS_OK_TEXT)}
      onCancel={onCancel}
      onOk={onOkHandler}
      open
      title={title}
      width={MODAL_WIDTH * 100 + 'vw'}
    >
      <h3>{message}</h3>
      <InputNumber
        min={0}
        onChange={setAmount}
        value={amount}
      />
    </Modal>
  )
}

InsertRowsModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
}

export {
  InsertRowsModal,
}
