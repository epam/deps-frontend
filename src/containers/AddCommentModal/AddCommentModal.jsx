
import PropTypes from 'prop-types'
import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'
import { TextArea } from './AddCommentModal.styles'

const MODAL_WIDTH = 0.5

const AddCommentModal = ({
  disabled,
  onOk,
  title,
}) => {
  const [comment, setComment] = useState('')
  const [visible, setVisible] = useState(false)

  const toggleVisibility = useCallback(() => {
    !disabled && setVisible((visible) => !visible)
  }, [disabled])

  const setInitialState = useCallback(() => {
    toggleVisibility()
    setComment('')
  }, [toggleVisibility])

  const onOkHandler = useCallback(() => {
    onOk(comment)
    setInitialState()
  }, [onOk, comment, setInitialState])

  const onChangeHandler = useCallback((e) => {
    setComment(e.target.value)
  }, [])

  const okButtonProps = useMemo(() => ({
    disabled: comment === '',
  }), [comment])

  return (
    <>
      <Button.Text
        disabled={disabled}
        onClick={toggleVisibility}
      >
        {title}
      </Button.Text>
      <Modal
        okButtonProps={okButtonProps}
        okText={localize(Localization.ADD_COMMENT_OK_TEXT)}
        onCancel={setInitialState}
        onOk={onOkHandler}
        open={visible}
        title={title}
        width={MODAL_WIDTH * 100 + 'vw'}
      >
        <TextArea
          autoSize={
            {
              minRows: 2,
              maxRows: 4,
            }
          }
          onChange={onChangeHandler}
          placeholder={localize(Localization.ADD_COMMENT_PLACEHOLDER)}
          value={comment}
        />
      </Modal>
    </>
  )
}

AddCommentModal.propTypes = {
  disabled: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
}

export { AddCommentModal }
