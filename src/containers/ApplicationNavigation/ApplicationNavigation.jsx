
import PropTypes from 'prop-types'
import { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { goTo } from '@/actions/navigation'
import { ChartPie } from '@/components/Icons/ChartPieIcon'
import { ClipboardIcon } from '@/components/Icons/ClipboardIcon'
import { DocumentIcon } from '@/components/Icons/DocumentIcon'
import { FolderClosedIcon } from '@/components/Icons/FolderClosedIcon'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { NoteStickyIcon } from '@/components/Icons/NoteStickyIcon'
import { UserIcon } from '@/components/Icons/UserIcon'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { Sidebar, FontIconWrapper } from './ApplicationNavigation.styles'
import { HelpGroupNavigationItems } from './HelpGroupNavigationItems'
import { RemoteMFENavigationItems } from './RemoteMFENavigationItems'

const getNavConfig = () => ([
  [{
    path: navigationMap.documentTypes(),
    title: localize(Localization.DOCUMENT_TYPES),
    icon: (
      <FontIconWrapper>
        <LayerGroupIcon />
      </FontIconWrapper>
    ),
  }],
  [{
    path: navigationMap.documents(),
    title: localize(Localization.DOCUMENTS),
    icon: (
      <FontIconWrapper>
        <DocumentIcon />
      </FontIconWrapper>
    ),
  }],
  [(() => ENV.FEATURE_DOCUMENT_TYPES_GROUPS && ({
    path: navigationMap.documentTypesGroups(),
    title: localize(Localization.DOCUMENT_TYPES_GROUPS),
    icon: (
      <FontIconWrapper>
        <FolderClosedIcon />
      </FontIconWrapper>
    ),
  }))()],
  [(() => ENV.FEATURE_FILES_BATCH && ({
    path: navigationMap.batches(),
    title: localize(Localization.BATCHES),
    icon: (
      <FontIconWrapper>
        <NoteStickyIcon />
      </FontIconWrapper>
    ),
  }))()],
  [(() => ENV.FEATURE_FILES && ({
    path: navigationMap.files(),
    title: localize(Localization.FILES),
    icon: (
      <FontIconWrapper>
        <ClipboardIcon />
      </FontIconWrapper>
    ),
  }))()],
  [(() => ENV.FEATURE_USER_MANAGEMENT && ({
    path: navigationMap.management.organisationUsers(),
    title: localize(Localization.USER_MANAGEMENT_TITLE),
    icon: (
      <FontIconWrapper>
        <UserIcon />
      </FontIconWrapper>
    ),
  }))()],
  [(() => ENV.FEATURE_DASHBOARD && ({
    path: navigationMap.dashboard(),
    title: localize(Localization.DASHBOARD),
    icon: (
      <FontIconWrapper>
        <ChartPie />
      </FontIconWrapper>
    ),
  }))()],
])

const ApplicationNavigation = ({ goTo, location: { pathname } }) => {
  const [sidebarConfig] = useState(() => {
    const config = getNavConfig()
    return config.map((item) => item.filter((el) => !!el))
  })

  const onClickHandler = (path) => path && goTo(path)

  const renderExtra = () => (
    <>
      <RemoteMFENavigationItems />
      <HelpGroupNavigationItems />
    </>
  )

  return (
    <Sidebar
      collapsed
      config={sidebarConfig}
      onClick={onClickHandler}
      renderExtraItems={renderExtra}
      selectedKeys={[pathname]}
    />
  )
}

ApplicationNavigation.propTypes = {
  goTo: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

const ConnectedComponent = withRouter(connect(null, { goTo })(ApplicationNavigation))

export {
  ConnectedComponent as ApplicationNavigation,
}
