
import PropTypes from 'prop-types'
import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeKeyToAssign } from '@/actions/prototypePage'
import { FaCircleCheckIcon } from '@/components/Icons/FaCircleCheckIcon'
import { PaperclipIcon } from '@/components/Icons/PaperclipIcon'
import { Localization, localize } from '@/localization/i18n'
import { keyValuePairLayoutShape } from '@/models/DocumentLayout'
import { keyToAssignSelector } from '@/selectors/prototypePage'
import {
  FieldWrapper,
  FieldTitle,
  FieldValue,
  ValueWrapper,
  ButtonIcon,
  StyledBadge,
} from './KeyValueItem.styles'

const ASSIGN_KEY_VALUE_BUTTON_TOOLTIP = {
  title: localize(Localization.ASSIGN_KEY_VALUE_TOOLTIP),
}

const KeyValueItem = ({ item, checkIsKeyAssigned }) => {
  const dispatch = useDispatch()
  const activeKeyToAssign = useSelector(keyToAssignSelector)

  const { key, value } = item

  const isKeyValueActive = activeKeyToAssign === key.content

  const isAssigned = checkIsKeyAssigned(key.content)

  const copyField = () => {
    dispatch(storeKeyToAssign(key.content))
  }

  const renderFieldItem = useCallback((label, content) => (
    <ValueWrapper>
      <FieldTitle>
        {label}
      </FieldTitle>
      <FieldValue $active={isKeyValueActive}>
        {content}
      </FieldValue>
    </ValueWrapper>
  ), [isKeyValueActive])

  return (
    <FieldWrapper>
      {renderFieldItem(localize(Localization.KEY), key.content)}
      {renderFieldItem(localize(Localization.VALUE), value?.content)}
      <StyledBadge count={isAssigned ? <FaCircleCheckIcon /> : 0}>
        <ButtonIcon
          $active={isKeyValueActive}
          icon={<PaperclipIcon />}
          onClick={copyField}
          tooltip={ASSIGN_KEY_VALUE_BUTTON_TOOLTIP}
        />
      </StyledBadge>
    </FieldWrapper>
  )
}

KeyValueItem.propTypes = {
  item: keyValuePairLayoutShape.isRequired,
  checkIsKeyAssigned: PropTypes.func.isRequired,
}

const memoizedItem = memo(KeyValueItem)

export {
  memoizedItem as KeyValueItem,
}
