
import { useContext } from 'react'
import { FieldCalibrationContext } from '@/containers/PromptCalibrationStudio/providers'

export const useFieldCalibration = () => useContext(FieldCalibrationContext)
