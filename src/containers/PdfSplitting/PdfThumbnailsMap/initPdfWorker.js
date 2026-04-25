
import { pdfjs } from 'react-pdf'

export const initPdfWorker = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
}
