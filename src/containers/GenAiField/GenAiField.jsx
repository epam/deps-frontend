
import { useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteFields, updateField } from '@/actions/genAiData'
import {
  ContentWrapper,
  FieldWrapper,
} from '@/containers/DocumentField'
import { Localization, localize } from '@/localization/i18n'
import { genAiFieldShape } from '@/models/GenAiField'
import { areGenAiFieldsDeletingSelector, areGenAiFieldsFetchingSelector } from '@/selectors/requests'
import { notifyRequest } from '@/utils/notification'
import { FieldControls } from './FieldControls'
import { KeyField } from './KeyField'
import { ValueField } from './ValueField'

const GenAiField = ({
  field: {
    key,
    value,
    id,
  },
}) => {
  const dispatch = useDispatch()
  const areFieldsDeleting = useSelector(areGenAiFieldsDeletingSelector)
  const areFieldsFetching = useSelector(areGenAiFieldsFetchingSelector)

  const deleteField = useCallback(async () => {
    await notifyRequest(dispatch(deleteFields([id])))({
      success: localize(Localization.DELETE_GEN_AI_FIELD_MESSAGE, { key }),
      warning: localize(Localization.DEFAULT_ERROR),
      fetching: localize(Localization.DELETE_GEN_AI_FIELD_MESSAGE_IN_PROGRESS, { key }),
    })
  }, [
    dispatch,
    key,
    id,
  ])

  const updateKey = useCallback((event) => {
    const inputValue = event.target.value

    if (inputValue === key) {
      return
    }

    dispatch(updateField({
      key: inputValue,
      value,
      id,
    }))
  }, [
    dispatch,
    value,
    id,
    key,
  ])

  const updateValue = useCallback((inputValue) => {
    if (inputValue === value) {
      return
    }

    dispatch(updateField({
      key,
      value: inputValue,
      id,
    }))
  }, [
    dispatch,
    key,
    id,
    value,
  ])

  return (
    <FieldWrapper>
      <ContentWrapper>
        <KeyField
          updateField={updateKey}
          value={key}
        />
        <ValueField
          updateField={updateValue}
          value={value}
        />
        <FieldControls
          disabled={areFieldsDeleting || areFieldsFetching}
          onDelete={deleteField}
        />
      </ContentWrapper>
    </FieldWrapper>
  )
}

GenAiField.propTypes = {
  field: genAiFieldShape,
}

const memoizedField = memo(GenAiField)

export {
  memoizedField as GenAiField,
}
