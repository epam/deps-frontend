
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { CustomSelect, SelectMode } from '@/components/Select'
import { ManageLabelsModalButton } from '@/containers/ManageLabelsModalButton'
import { Localization, localize } from '@/localization/i18n'
import { Label, labelShape } from '@/models/Label'

const AddLabelsPicker = ({ onChange, value }) => {
  const updateLabels = useCallback((values) => {
    const updatedLabels = value.filter((label) => values.includes(label._id))
    onChange(updatedLabels)
  }, [value, onChange])

  const addLabel = useCallback((label) => {
    const labelExists = value.some((l) => l._id === label._id)

    if (labelExists) {
      return
    }

    onChange([...value, label])
  }, [value, onChange])

  const clearLabels = useCallback(() => {
    onChange([])
  }, [onChange])

  const renderSelect = useCallback((showModal) => (
    <CustomSelect
      allowClear
      mode={SelectMode.TAGS}
      onChange={updateLabels}
      onClear={clearLabels}
      onDropdownVisibleChange={showModal}
      open={false}
      options={value.map(Label.toOption)}
      placeholder={localize(Localization.SELECT_LABEL)}
      value={value.map((l) => l._id)}
    />
  ), [
    value,
    updateLabels,
    clearLabels,
  ])

  return (
    <ManageLabelsModalButton
      onSubmit={addLabel}
      renderTrigger={renderSelect}
      title={localize(Localization.ADD_LABEL)}
    />
  )
}

AddLabelsPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    labelShape,
  ).isRequired,
}

export {
  AddLabelsPicker,
}
