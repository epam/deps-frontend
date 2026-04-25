
import { useContext } from 'react'
import { FilesSplittingContext } from '@/containers/BatchFilesSplittingDrawer/providers'

export const useFilesSplitting = () => useContext(FilesSplittingContext)
