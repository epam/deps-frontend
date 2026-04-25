
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { LongText } from '@/components/LongText'
import { PreviewDocument } from '@/components/PreviewDocument'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSearchDropdown } from '@/components/Table/TableSearchDropdown'
import { DOCUMENT_TITLES } from '@/constants/automation'
import { FILE_EXTENSION_TO_DISPLAY_TEXT } from '@/enums/FileExtension'
import { removeFileExtension } from '@/utils/file'
import { getFileExtension } from '@/utils/getFileExtension'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from './DocumentColumn'
import { Title } from './documentColumn.styles'

const generateDocumentTitleColumn = ({
  filteredValue,
  sortOrder,
}) => ({
  ellipsis: true,
  filterDropdown: ({ setSelectedKeys, confirm, visible }) => (
    <TableSearchDropdown
      confirm={() => confirm({ closeDropdown: false })}
      onChange={setSelectedKeys}
      searchValue={filteredValue}
      visible={visible}
    />
  ),
  filterIcon: (
    <TableFilterIndicator
      active={!!filteredValue?.length}
      icon={<SearchIcon />}
    />
  ),
  filteredValue,
  key: DocumentColumn.TITLE,
  sorter: true,
  width: 200,
  sortOrder,
  title: RESOURCE_DOCUMENT_COLUMN[DocumentColumn.TITLE],
  render: (record) => {
    const extension = getFileExtension(record.title)
    const fileExtension = FILE_EXTENSION_TO_DISPLAY_TEXT[extension]
    const titleWithoutExtension = removeFileExtension(record.title)

    return (
      <span data-automation={DOCUMENT_TITLES}>
        <Title>
          <PreviewDocument
            childDocuments={record.childDocuments}
            fileExtension={fileExtension}
          />
          <LongText text={titleWithoutExtension} />
        </Title>
      </span>
    )
  },
})

export {
  generateDocumentTitleColumn,
}
