/* eslint-disable no-undef */
import FileSaver from 'file-saver'
import { FileExtension } from '@/enums/FileExtension'
import {
  getFileSizeStr,
  readFile,
  readFileData,
  saveToFile,
  getDownloadFileName,
  removeFileExtension,
} from '../file'

jest.mock('file-saver', () => ({ saveAs: jest.fn() }))

describe('Utils: file.js', () => {
  it('should return file size with MB', () => {
    expect(getFileSizeStr(100000000)).toEqual(expect.stringMatching('MB'))
  })

  it('should return file size with KB', () => {
    expect(getFileSizeStr(3500)).toEqual(expect.stringMatching('KB'))
  })

  it('should return file size with bite', () => {
    expect(getFileSizeStr(800)).toEqual(expect.stringMatching('B'))
  })

  it('should return correct file size', () => {
    expect(getFileSizeStr(3500)).toBe('3 KB')
  })

  const mockFileContent = 'test file content'
  const fakeFile = new File([mockFileContent], 'test.txt', { type: 'text/plain' })

  const mockInputElement = {
    type: '',
    style: '',
    accept: '',
    click: jest.fn(),
    onchange: null,
  }

  document.createElement = jest.fn(() => mockInputElement)

  const mockFileReaderInstance = {
    readAsText: jest.fn(),
    onload: null,
  }

  global.FileReader = jest.fn(() => mockFileReaderInstance)

  test('reads file content with specified accept type', async () => {
    const mockAccept = '.txt'

    const resultPromise = readFile(mockAccept)

    expect(document.createElement).toHaveBeenCalledWith('input')
    expect(mockInputElement.type).toBe('file')
    expect(mockInputElement.style).toBe('display: none')
    expect(mockInputElement.accept).toBe(mockAccept)
    expect(mockInputElement.click).toHaveBeenCalled()

    mockInputElement.onchange({
      target: {
        files: [fakeFile],
      },
    })

    expect(global.FileReader).toHaveBeenCalled()
    expect(mockFileReaderInstance.readAsText).toHaveBeenCalledWith(fakeFile, 'UTF-8')

    mockFileReaderInstance.onload({
      target: {
        result: mockFileContent,
      },
    })

    const result = await resultPromise
    expect(result).toBe(mockFileContent)
  })

  test('calls saveAs method with correct args', () => {
    saveToFile('test.txt', 'text/plain', 'mockFileContent')
    expect(FileSaver.saveAs)
      .toHaveBeenCalledWith(fakeFile)
  })

  test('removeFileExtension removes only trailing known extension', () => {
    const fileWithKnownExtension = 'document.short.pdf'
    const fileWithUnknownExtension = 'report.final'

    const resultWithKnownExtension = removeFileExtension(fileWithKnownExtension)
    const resultWithUnknownExtension = removeFileExtension(fileWithUnknownExtension)

    expect(resultWithKnownExtension).toBe('document.short')
    expect(resultWithUnknownExtension).toBe('report.final')
  })

  test('getDownloadFileName adds extension if missing', () => {
    const name = getDownloadFileName({
      extension: FileExtension.PDF,
      title: 'document',
    })
    expect(name).toBe('document.pdf')
  })

  test('should handle file names with dots correctly', () => {
    const name = getDownloadFileName({
      extension: FileExtension.PDF,
      title: 'document.short.pdf',
    })
    expect(name).toBe('document.short.pdf')
  })

  test('readFileData: reads data from specified file', async () => {
    const resultPromise = readFileData(fakeFile)

    expect(global.FileReader).toHaveBeenCalled()
    expect(mockFileReaderInstance.readAsText).toHaveBeenCalledWith(fakeFile, 'UTF-8')

    mockFileReaderInstance.onload({
      target: {
        result: mockFileContent,
      },
    })

    const data = await resultPromise
    expect(data).toBe(mockFileContent)
  })
})
