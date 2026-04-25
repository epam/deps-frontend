
import { useMemo } from 'react'
import { localize, Localization } from '@/localization/i18n'
import { AddFieldDrawer } from './AddFieldDrawer'
import { CALIBRATION_MODE } from './constants'
import { FieldsEmptyState } from './FieldsEmptyState'
import { FieldsList } from './FieldsList'
import { useFieldCalibration } from './hooks'
import {
  Wrapper,
  FieldsHeader,
  FieldsHeaderText,
} from './PromptCalibrationStudio.styles'
import { FieldCalibrationProvider } from './providers'
import { ReorderFieldsButton } from './ReorderFieldsButton'

const PromptCalibrationStudio = () => {
  const {
    fields,
    calibrationMode,
    addField,
    extractors,
    defaultExtractor,
  } = useFieldCalibration()

  const hasFields = !!fields.length

  const FieldsSection = useMemo(() => {
    if (hasFields) {
      return (
        <FieldsList extractors={extractors} />
      )
    }

    return (
      <FieldsEmptyState
        add={addField}
        defaultExtractorId={defaultExtractor.id}
      />
    )
  }, [
    hasFields,
    addField,
    defaultExtractor.id,
    extractors,
  ])

  return (
    <Wrapper>
      <FieldsHeader>
        <FieldsHeaderText>
          {localize(Localization.FIELDS)}
        </FieldsHeaderText>
        {
          hasFields && calibrationMode !== CALIBRATION_MODE.ADVANCED && (
            <>
              <AddFieldDrawer
                add={addField}
                defaultExtractorId={defaultExtractor.id}
              />
              <ReorderFieldsButton />
            </>
          )
        }
      </FieldsHeader>
      {FieldsSection}
    </Wrapper>
  )
}

const PromptCalibrationStudioWithProvider = (props) => {
  return (
    <FieldCalibrationProvider {...props}>
      <PromptCalibrationStudio />
    </FieldCalibrationProvider>
  )
}

export {
  PromptCalibrationStudioWithProvider as PromptCalibrationStudio,
}
