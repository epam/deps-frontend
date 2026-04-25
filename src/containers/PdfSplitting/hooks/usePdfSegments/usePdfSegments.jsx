
import { useContext } from 'react'
import { PdfSegmentsContext } from '@/containers/PdfSplitting/providers'

export const usePdfSegments = () => {
  return useContext(PdfSegmentsContext)
}
