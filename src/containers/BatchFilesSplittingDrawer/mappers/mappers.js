
import { PdfSplitter } from '@/containers/PdfSplitting'
import { FileExtension } from '@/enums/FileExtension'
import { getFileExtension } from '@/utils/getFileExtension'
import { SplittableFile } from '../viewModels'

export const mapFilesToFilesData = async (splittableFiles, batchFiles) => {
  const nonPdfFiles = batchFiles.filter((file) => getFileExtension(file.name) !== FileExtension.PDF)
  const nonPdfFilesData = nonPdfFiles.map((file) => ({ file }))

  const pdfFilesData = []

  for (const { source, segments } of splittableFiles) {
    const filesData = await PdfSplitter.getSplittedFilesData({
      documentName: source.name,
      pdfFile: source,
      segments,
    })

    pdfFilesData.push(...filesData)
  }

  return [...nonPdfFilesData, ...pdfFilesData]
}

export const mapFilesToSplittableFiles = (files, splittableFiles) => (
  files
    .filter((file) => getFileExtension(file.name) === FileExtension.PDF)
    .map((file) => {
      const existedFile = splittableFiles.find((splittableFile) => splittableFile.source.uid === file.uid)

      if (!existedFile) {
        return new SplittableFile({
          source: file,
          segments: [],
          batchName: null,
        })
      }

      return existedFile
    })
)
