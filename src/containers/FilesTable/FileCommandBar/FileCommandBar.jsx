
import { useMemo } from 'react'
import { DeleteFile } from '@/containers/DeleteFile'
import { fileShape } from '@/models/File'
import { StyledCommandBar } from './FileCommandBar.styles'

export const FileCommandBar = ({ file }) => {
  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <DeleteFile
          file={file}
        />
      ),
    },
  ], [file])

  return (
    <StyledCommandBar commands={commands} />
  )
}

FileCommandBar.propTypes = {
  file: fileShape.isRequired,
}
