
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { Localization, localize } from '@/localization/i18n'
import {
  DeleteIconButton,
  MappingKeyInput,
  MappingKeyWrapper,
} from './EditableMappingKey.styles'

const DEBOUNCE_TIME = 500
const MAX_INPUT_LENGTH = 150

const EditableMappingKey = ({
  isDeletingAllowed,
  mappingKey,
  mappingKeyIndex,
  removeMappingKey,
  updateMappingKey,
}) => {
  const [inputValue, setInputValue] = useState(mappingKey)

  const debounceOnChange = useMemo(() =>
    debounce((value) => {
      updateMappingKey(mappingKey, value)
    }, DEBOUNCE_TIME),
  [mappingKey, updateMappingKey],
  )

  const onChange = useCallback((e) => {
    const value = e.target.value
    setInputValue(value)
    debounceOnChange(value)
  }, [debounceOnChange])

  const onDelete = useCallback(() => {
    removeMappingKey(mappingKeyIndex)
  }, [mappingKeyIndex, removeMappingKey])

  useEffect(() => {
    setInputValue(mappingKey)
  }, [mappingKey])

  return (
    <MappingKeyWrapper>
      <MappingKeyInput
        maxLength={MAX_INPUT_LENGTH}
        onChange={onChange}
        placeholder={localize(Localization.ENTER_KEY)}
        value={inputValue}
      />
      {
        isDeletingAllowed && (
          <DeleteIconButton
            icon={<XMarkIcon />}
            onClick={onDelete}
          />
        )
      }
    </MappingKeyWrapper>
  )
}

EditableMappingKey.propTypes = {
  isDeletingAllowed: PropTypes.bool.isRequired,
  mappingKey: PropTypes.string.isRequired,
  mappingKeyIndex: PropTypes.number.isRequired,
  removeMappingKey: PropTypes.func.isRequired,
  updateMappingKey: PropTypes.func.isRequired,
}

export {
  EditableMappingKey,
}
