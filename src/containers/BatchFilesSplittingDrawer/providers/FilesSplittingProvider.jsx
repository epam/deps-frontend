
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import {
  useEffect,
  useMemo,
  useState,
  createContext,
} from 'react'
import { mapFilesToSplittableFiles } from '../mappers'
import { areFilesEqual } from '../utils'
import { BatchSettings, batchSettingsShape } from '../viewModels'

export const FilesSplittingContext = createContext(null)

export const FilesSplittingProvider = ({ children, files = [], settings }) => {
  const [batchSettings, setBatchSettings] = useState({})
  const [batchFiles, setBatchFiles] = useState([])
  const [splittableFiles, setSplittableFile] = useState([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)

  useEffect(() => {
    const newBatchSettings = new BatchSettings(settings)
    !isEqual(batchSettings, newBatchSettings) && setBatchSettings(newBatchSettings)
  }, [batchSettings, settings])

  useEffect(() => {
    if (!areFilesEqual(batchFiles, files)) {
      setBatchFiles(files)
      setSplittableFile(mapFilesToSplittableFiles(files, splittableFiles))
    }
  }, [
    files,
    batchFiles,
    splittableFiles,
  ])

  const value = useMemo(
    () => ({
      batchSettings,
      setBatchSettings,
      setBatchFiles,
      batchFiles,
      splittableFiles,
      currentFileIndex,
      setCurrentFileIndex,
      setSplittableFile,
    }),
    [
      batchSettings,
      batchFiles,
      currentFileIndex,
      splittableFiles,
      setSplittableFile,
    ],
  )

  return (
    <FilesSplittingContext.Provider value={value}>
      {children}
    </FilesSplittingContext.Provider>
  )
}

FilesSplittingProvider.propTypes = {
  children: PropTypes.node.isRequired,
  settings: batchSettingsShape.isRequired,
  files: PropTypes.arrayOf(
    PropTypes.instanceOf(Blob),
  ).isRequired,
}
