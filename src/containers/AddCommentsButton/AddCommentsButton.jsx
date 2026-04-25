
import { useCallback, useState } from 'react'
import { Button } from '@/components/Button'
import { CommentIcon } from '@/components/Icons/CommentIcon'
import { DocumentComments } from '@/containers/DocumentComments'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { TitleDrawer, Wrapper, Drawer } from './AddCommentsButton.styles'

const AddCommentsButton = () => {
  const [visible, setVisible] = useState(false)

  const onAddCommentsClick = useCallback(() => {
    setVisible(true)
  }, [])

  const getContainer = useCallback(() => document.body, [])

  const onClose = useCallback(() => {
    setVisible(false)
  }, [])

  const renderCommentsButton = () => (
    <Button.Text
      onClick={onAddCommentsClick}
    >
      {localize(Localization.ADD_COMMENT_ACTION)}
    </Button.Text>
  )

  const renderTitleDrawer = () => (
    <TitleDrawer>
      <CommentIcon />
      {localize(Localization.COMMENTS_TITLE)}
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
      {visible && <DocumentComments />}
    </Drawer>
  )

  return (
    <Wrapper>
      {renderCommentsButton()}
      {renderDrawer()}
    </Wrapper>
  )
}

export {
  AddCommentsButton,
}
