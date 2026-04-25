
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { ThemeProvider } from 'styled-components'
import { Button } from '@/components/Button'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { StyledList } from './UnsupportedFilesList.styles'

const UnsupportedFilesList = ({ files }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = useCallback(() => {
    setVisible((visible) => !visible)
  }, [])

  if (files.length === 1) {
    return localize(Localization.FILE_UNSUPPORTED_FORMAT, { fileName: files[0] })
  }

  const notificationMessage =
    localize(Localization.UNSUPPORTED_EXTENSION_NOTIFICATION,
      {
        fileName: files[0],
        filesQty: files.length - 1,
      })

  const renderItem = (item, idx) => (
    <StyledList.Item key={idx}>
      {<>&bull; </>}
      {item}
    </StyledList.Item>
  )

  const renderItemList = () => (
    <StyledList
      dataSource={files.slice(1)}
      renderItem={
        (item, idx) => renderItem(item, idx)
      }
    />
  )

  const renderButton = () => (
    <Button.Link
      onClick={toggleVisibility}
    >
      {localize(Localization.SHOW_FILES)}
    </Button.Link>
  )

  return (
    <ThemeProvider theme={theme}>
      {notificationMessage}
      <br />
      {
        !visible
          ? renderButton()
          : renderItemList()
      }
    </ThemeProvider>
  )
}

UnsupportedFilesList.propTypes = {
  files: PropTypes.arrayOf(PropTypes.string),
}

export {
  UnsupportedFilesList,
}
