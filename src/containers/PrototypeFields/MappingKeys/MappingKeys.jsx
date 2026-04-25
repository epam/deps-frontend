
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { TagIcon } from '@/components/Icons/TagIcon'
import { MenuTrigger } from '@/components/Menu'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { EditableMappingKey } from './EditableMappingKey'
import {
  IconButton,
  Wrapper,
  KeysWrapper,
  Counter,
  TagButton,
  Tooltip,
} from './MappingKeys.styles'
import { ReadOnlyMappingKey } from './ReadOnlyMappingKey'

const ADD_KEY_BUTTON_TOOLTIP = {
  title: localize(Localization.ADD_NEW_KEY),
}

const MAX_VISIBLE_MAPPING_KEYS = 3
const MIN_MAPPING_KEYS_COUNT = 1

const MappingKeys = ({
  keys,
  updateMappingKeys,
  isEditMode,
}) => {
  const shouldAddingBeDisabled = keys.some((key) => !key.trim().length)
  const isDeletingAllowed = keys.length > MIN_MAPPING_KEYS_COUNT

  const updateKey = useCallback((prevKey, curKey) => {
    const updatedMappingKeys = keys.map(
      (key) => key === prevKey ? curKey : key,
    )

    updateMappingKeys(updatedMappingKeys)
  }, [keys, updateMappingKeys])

  const addNewKey = useCallback(() => (
    updateMappingKeys(['', ...keys])
  ), [keys, updateMappingKeys])

  const removeKey = useCallback((removedKeyIndex) => {
    const updatedMappingKeys = keys.filter(
      (key, index) => index !== removedKeyIndex,
    )
    updateMappingKeys(updatedMappingKeys)
  }, [keys, updateMappingKeys])

  const getMappingKeys = useCallback((keys, areKeysHidden = false) =>
    keys.map((key, index) => (
      isEditMode ? (
        <EditableMappingKey
          key={index}
          isDeletingAllowed={isDeletingAllowed}
          mappingKey={key}
          mappingKeyIndex={areKeysHidden ? index + MAX_VISIBLE_MAPPING_KEYS : index}
          removeMappingKey={removeKey}
          updateMappingKey={updateKey}
        />
      ) : (
        <ReadOnlyMappingKey
          key={index}
          mappingKey={key}
        />
      )
    )), [
    isDeletingAllowed,
    isEditMode,
    removeKey,
    updateKey,
  ])

  const getVisibleMappingKeys = useCallback((keys) => {
    const mappingKeys = getMappingKeys(keys)

    return (
      <KeysWrapper>
        {mappingKeys}
      </KeysWrapper>
    )
  }, [getMappingKeys])

  const getHiddenMappingKeys = useCallback((keys) => {
    const mappingKeys = getMappingKeys(keys, true)

    return (
      <Tooltip
        getPopupContainer={(trigger) => trigger.parentNode}
        placement={Placement.BOTTOM}
        title={mappingKeys}
        trigger={MenuTrigger.CLICK}
      >
        <TagButton>
          <TagIcon />
          <Counter>
            +
            {keys.length}
          </Counter>
        </TagButton>
      </Tooltip>
    )
  }, [getMappingKeys])

  const FieldMappingKeys = useMemo(() => {
    const mappingKeys = [...keys]
    const visibleKeys = mappingKeys.splice(0, MAX_VISIBLE_MAPPING_KEYS)

    return (
      <>
        {getVisibleMappingKeys(visibleKeys)}
        {
          !!mappingKeys.length &&
          getHiddenMappingKeys(mappingKeys)
        }
      </>
    )
  }, [
    getHiddenMappingKeys,
    getVisibleMappingKeys,
    keys,
  ])

  return (
    <Wrapper>
      {FieldMappingKeys}
      {
        isEditMode && (
          <IconButton
            disabled={shouldAddingBeDisabled}
            icon={<PlusFilledIcon />}
            onClick={addNewKey}
            tooltip={ADD_KEY_BUTTON_TOOLTIP}
          />
        )
      }
    </Wrapper>
  )
}

MappingKeys.propTypes = {
  keys: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  updateMappingKeys: PropTypes.func,
  isEditMode: PropTypes.bool,
}

export {
  MappingKeys,
}
