
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Progress } from '@/components/Progress'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { pickedFileShape } from '@/containers/ManageBatch/PickedFile'
import { useUploadBatchFiles } from '@/containers/ManageBatch/useUploadBatchFiles'
import {
  FileCardWrapper,
  TrashIcon,
  CardHeader,
  AngleDownIcon,
} from './FileCard.styles'
import { FileName } from './FileName'
import { FileSettings } from './FileSettings'

const TEST_ID = {
  TRASH_ICON: 'trash-icon',
  PROGRESS: 'progress',
}

export const FileCard = ({ fileData, index }) => {
  const [isOpen, setIsOpen] = useState(false)

  const { areFilesUploading } = useUploadBatchFiles()

  const files = useWatch({ name: FIELD_FORM_CODE.FILES })

  const { setValue } = useFormContext()

  const removeFile = () => {
    const newFiles = files.filter((fd) => fd.file.uid !== fileData.file.uid)
    setValue(FIELD_FORM_CODE.FILES, newFiles)
  }

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <FileCardWrapper
      $isOpen={isOpen}
    >
      <CardHeader
        onClick={toggleOpen}
      >
        <AngleDownIcon $isOpen={isOpen} />
        <FileName
          fileData={fileData}
        />
        {
          areFilesUploading
            ? (
              <Progress
                data-testid={TEST_ID.PROGRESS}
              />
            )
            : (
              <TrashIcon
                data-testid={TEST_ID.TRASH_ICON}
                onClick={removeFile}
              />
            )
        }
      </CardHeader>
      <FileSettings
        index={index}
        isVisible={isOpen}
      />
    </FileCardWrapper>
  )
}

FileCard.propTypes = {
  fileData: pickedFileShape.isRequired,
  index: PropTypes.number.isRequired,
}
