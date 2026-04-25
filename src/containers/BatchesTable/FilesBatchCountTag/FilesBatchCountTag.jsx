
import PropTypes from 'prop-types'
import { Dropdown } from '@/components/Dropdown'
import { LongText } from '@/components/LongText'
import { MenuTrigger } from '@/components/Menu'
import { Tooltip } from '@/components/Tooltip'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { batchFileMinimizedShape } from '@/models/Batch'
import {
  Tag,
  FilesIcon,
  WarningIcon,
  Menu,
  MenuItemContent,
  MenuItem,
} from './FilesBatchCountTag.styles'

const TEST_ID = {
  WARNING_ICON: 'warning-icon',
  FILES_ICON: 'files-icon',
}

const FilesBatchCountTag = ({ files }) => {
  const preventRedirectionToDocument = (e) => {
    e.stopPropagation()
  }

  const filesWithErrors = files.filter((file) => !!file.error)

  const renderDropdownMenu = () => {
    return (
      <Menu>
        {
          filesWithErrors.map((file, index) => (
            <MenuItem
              key={index}
              onClick={preventRedirectionToDocument}
            >
              <MenuItemContent>
                <LongText text={file.name} />
                <Tooltip title={RESOURCE_ERROR_TO_DISPLAY[file.error.code] ?? localize(Localization.DEFAULT_ERROR)}>
                  <WarningIcon data-testid={TEST_ID.WARNING_ICON} />
                </Tooltip>
              </MenuItemContent>
            </MenuItem>
          ))
        }
      </Menu>
    )
  }

  if (!filesWithErrors.length) {
    return (
      <Tag
        $hasErrors={!!filesWithErrors.length}
        closable={false}
      >
        <FilesIcon
          $hasErrors={!!filesWithErrors.length}
          data-testid={TEST_ID.FILES_ICON}
        />
        {files.length}
      </Tag>
    )
  }

  return (
    <Dropdown
      dropdownRender={renderDropdownMenu}
      trigger={MenuTrigger.CLICK}
    >
      <Tag
        $hasErrors={!!filesWithErrors.length}
        closable={false}
        onClick={preventRedirectionToDocument}
      >
        <FilesIcon
          $hasErrors={!!filesWithErrors.length}
          data-testid={TEST_ID.FILES_ICON}
        />
        {files.length}
      </Tag>
    </Dropdown>
  )
}

FilesBatchCountTag.propTypes = {
  files: PropTypes.arrayOf(
    batchFileMinimizedShape,
  ).isRequired,
}

export {
  FilesBatchCountTag,
}
