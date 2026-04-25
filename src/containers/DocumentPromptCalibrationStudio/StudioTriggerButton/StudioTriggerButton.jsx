
import { useDispatch, useSelector } from 'react-redux'
import { clearActivePolygons, setHighlightedField } from '@/actions/documentReviewPage'
import { Button } from '@/components/Button'
import { DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { DocumentState } from '@/enums/DocumentState'
import { useQueryParams } from '@/hooks/useQueryParams'
import { localize, Localization } from '@/localization/i18n'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'

const STUDIO_VISIBLE = 1

export const StudioTriggerButton = () => {
  const dispatch = useDispatch()
  const { setQueryParams } = useQueryParams()

  const document = useSelector(documentSelector)
  const documentType = useSelector(documentTypeSelector)

  const isAvailable = (
    document.state === DocumentState.IN_REVIEW &&
    documentType !== UNKNOWN_DOCUMENT_TYPE
  )

  const openPromptCalibrationStudio = () => {
    dispatch(setHighlightedField(null))
    dispatch(clearActivePolygons())
    setQueryParams({
      [DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: STUDIO_VISIBLE,
    })
  }

  return (
    <Button.Text
      disabled={!isAvailable}
      onClick={openPromptCalibrationStudio}
    >
      {localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO)}
    </Button.Text>
  )
}
