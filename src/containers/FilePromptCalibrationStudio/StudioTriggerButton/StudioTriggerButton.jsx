
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { clearActivePolygons, setHighlightedField } from '@/actions/fileReviewPage'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { Button } from '@/components/Button'
import { FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { FileStatus } from '@/enums/FileStatus'
import { useQueryParams } from '@/hooks/useQueryParams'
import { localize, Localization } from '@/localization/i18n'

const STUDIO_VISIBLE = 1

export const StudioTriggerButton = () => {
  const dispatch = useDispatch()
  const { setQueryParams } = useQueryParams()

  const { fileId } = useParams()

  const {
    data: file,
  } = useFetchFileQuery(fileId)

  const openPromptCalibrationStudio = () => {
    dispatch(setHighlightedField(null))
    dispatch(clearActivePolygons())
    setQueryParams({
      [FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]: STUDIO_VISIBLE,
    })
  }

  const isAvailable = file.state.status === FileStatus.COMPLETED

  return (
    <Button.Text
      disabled={!isAvailable}
      onClick={openPromptCalibrationStudio}
    >
      {localize(Localization.FEATURE_PROMPT_CALIBRATION_STUDIO)}
    </Button.Text>
  )
}
