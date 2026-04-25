
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { ExternalLinkAltIcon } from '@/components/Icons/ExternalLinkAlt'
import { TableActionIcon } from '@/components/TableActionIcon'
import { DocumentFilterKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { StyledCommandBar } from './DocumentTypeCommandBar.styles'

const REDIRECTION_BUTTON_TOOLTIP = {
  title: localize(Localization.GO_TO_DOCUMENTS),
}

const DocumentTypeCommandBar = ({ code }) => {
  const dispatch = useDispatch()

  const goToDocumentsPage = useCallback((e) => {
    e.stopPropagation()

    dispatch(goTo(
      navigationMap.documents(),
      {
        filters: {
          [DocumentFilterKeys.TYPES]: [code],
        },
      }))
  }, [
    dispatch,
    code,
  ])

  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <TableActionIcon
          icon={<ExternalLinkAltIcon />}
          onClick={goToDocumentsPage}
          tooltip={REDIRECTION_BUTTON_TOOLTIP}
        />
      ),
    },
  ], [
    goToDocumentsPage,
  ])

  return (
    <StyledCommandBar commands={commands} />
  )
}

DocumentTypeCommandBar.propTypes = {
  code: PropTypes.string.isRequired,
}

export {
  DocumentTypeCommandBar,
}
