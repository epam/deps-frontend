
import PropTypes from 'prop-types'
import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { Input } from '@/components/Input'
import { LongText } from '@/components/LongText'
import { TitleWrapper } from './TemplateVersionTitle.styles'

const TemplateVersionTitle = ({
  defaultTitle,
  isEditable,
  updateVersionName,
  placeholder,
}) => {
  const [title, setTitle] = useState(defaultTitle)

  const inputRef = useRef(null)

  const closeEditing = useCallback(() => {
    if (!title.trim()) {
      setTitle(defaultTitle)

      return updateVersionName(defaultTitle)
    }

    updateVersionName(title)
  }, [
    title,
    updateVersionName,
    defaultTitle,
  ])

  const changeTitle = useCallback((e) => (
    setTitle(e.target.value)
  ), [])

  const handleOnClick = useCallback((e) => (
    e.stopPropagation()
  ), [])

  useEffect(() => {
    isEditable && inputRef.current?.focus()
  }, [isEditable])

  if (!isEditable) {
    return (
      <TitleWrapper>
        <LongText text={title} />
      </TitleWrapper>
    )
  }

  return (
    <Input
      innerRef={inputRef}
      onBlur={closeEditing}
      onChange={changeTitle}
      onClick={handleOnClick}
      onPressEnter={closeEditing}
      placeholder={placeholder}
      value={title}
    />
  )
}

TemplateVersionTitle.propTypes = {
  defaultTitle: PropTypes.string.isRequired,
  isEditable: PropTypes.bool.isRequired,
  updateVersionName: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
}

export {
  TemplateVersionTitle,
}
