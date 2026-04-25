
import PropTypes from 'prop-types'
import { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { fetchDefaultWaitingsMeta } from '@/actions/orgUserManagementPage'
import { Spin } from '@/components/Spin'
import { ComponentSize } from '@/enums/ComponentSize'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultWaitingsMetaSelector } from '@/selectors/orgUserManagementPage'

const WaitingForApprovalTabTitle = ({
  user,
  fetchDefaultWaitingsMeta,
  waitingsDefaultMeta,
}) => {
  const [fetching, setFetching] = useState(true)

  const getWaitingForApprovalUsers = useCallback(
    async () => {
      try {
        await fetchDefaultWaitingsMeta(user.organisation.pk)
      } finally {
        setFetching(false)
      }
    },
    [
      user.organisation.pk,
      fetchDefaultWaitingsMeta,
    ],
  )

  useEffect(() => {
    setFetching(true)
    getWaitingForApprovalUsers()
  }, [getWaitingForApprovalUsers])

  if (fetching) {
    return (
      <Spin.Centered
        size={ComponentSize.SMALL}
        spinning
      />
    )
  }

  return localize(Localization.WAITING_FOR_APPROVAL, { count: waitingsDefaultMeta?.total })
}

WaitingForApprovalTabTitle.propTypes = {
  user: userShape.isRequired,
  fetchDefaultWaitingsMeta: PropTypes.func.isRequired,
  waitingsDefaultMeta: PropTypes.shape({
    total: PropTypes.number,
    size: PropTypes.number,
  }),
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
  waitingsDefaultMeta: orgDefaultWaitingsMetaSelector(state),
})

const mapDispatchToProps = {
  fetchDefaultWaitingsMeta,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(WaitingForApprovalTabTitle)

export { ConnectedComponent as WaitingForApprovalTabTitle }
