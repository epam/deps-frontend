
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { documentTypeShape } from '@/models/DocumentType'
import { outputProfileShape } from '@/models/OutputProfile'
import { DeleteOutputProfileButton } from '../DeleteOutputProfileButton'
import { EditOutputProfileButton } from '../EditOutputProfileButton'
import { CommandBar } from './OutputProfilesCommandBar.styles'

const OutputProfilesCommandBar = ({
  documentType,
  total,
  refreshTable,
  profile,
}) => {
  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <EditOutputProfileButton
          documentType={documentType}
          onAfterEditing={refreshTable}
          profile={profile}
        />
      ),
    },
    {
      renderComponent: () => (
        <DeleteOutputProfileButton
          documentTypeId={documentType.code}
          isDeletionAllowed={total > 1}
          onAfterDelete={refreshTable}
          profile={profile}
        />
      ),
    },
  ], [
    documentType,
    profile,
    refreshTable,
    total,
  ])

  return (
    <CommandBar commands={commands} />
  )
}

OutputProfilesCommandBar.propTypes = {
  documentType: documentTypeShape.isRequired,
  profile: outputProfileShape.isRequired,
  refreshTable: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
}

export {
  OutputProfilesCommandBar,
}
