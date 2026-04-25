
import { PDFDocument } from 'pdf-lib/dist/pdf-lib.js'
import { PdfSegment } from '@/containers/PdfSplitting/models'
import { FileExtension } from '@/enums/FileExtension'
import { MimeType } from '@/enums/MimeType'

class PdfSplitter {
  pdfDoc = null

  constructor (pdfDocumentService) {
    this.pdfDocumentService = pdfDocumentService
  }

  #createFileName = (name, index) => {
    const nameWithoutExtension = name.replace(FileExtension.PDF, '')

    return `${nameWithoutExtension}_${index + 1}${FileExtension.PDF}`
  }

  #getPdfFromBuffer = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const existingPdfBytes = new Uint8Array(arrayBuffer)
    const pdf = await this.pdfDocumentService.load(existingPdfBytes)

    return pdf
  }

  #getPdfBytesByRange = async (range) => {
    const newPdfDoc = await this.pdfDocumentService.create()
    const copiedPages = await newPdfDoc.copyPages(this.pdfDoc, range)
    copiedPages.forEach((page) => newPdfDoc.addPage(page))
    const newPdfBytes = await newPdfDoc.save()

    return newPdfBytes
  }

  #processSegments = async ({
    documentName,
    segments,
  }) => {
    const splitFilesData = []

    for (const s of segments) {
      const range = PdfSegment.getPageRangeFromSegment(s)
      const pdfBytes = await this.#getPdfBytesByRange(range)
      const fileName = this.#createFileName(documentName, splitFilesData.length)
      const file = new File(
        [pdfBytes],
        fileName,
        { type: MimeType.APPLICATION_PDF },
      )
      splitFilesData.push({
        file: file,
        name: file.name,
        documentTypeId: s.documentTypeId,
      })
    }

    return splitFilesData
  }

  getSplittedFilesData = async ({
    documentName,
    pdfFile,
    segments,
  }) => {
    this.pdfDoc = await this.#getPdfFromBuffer(pdfFile)
    const splittedFilesData = await this.#processSegments({
      documentName,
      segments,
    })

    return splittedFilesData
  }
}

const Splitter = new PdfSplitter(PDFDocument)

export {
  Splitter as PdfSplitter,
}
