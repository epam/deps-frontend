
import PropTypes from 'prop-types'
import { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { fetchDefaultInviteesMeta } from '@/actions/orgUserManagementPage'
import { Spin } from '@/components/Spin'
import { ComponentSize } from '@/enums/ComponentSize'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { orgDefaultInviteesMetaSelector } from '@/selectors/orgUserManagementPage'

const InviteesTabTitle = ({
  user,
  fetchDefaultInviteesMeta,
  inviteesDefaultMeta,
}) => {
  const [fetching, setFetching] = useState(true)

  const getInvitees = useCallback(
    async () => {
      try {
        await fetchDefaultInviteesMeta(user.organisation.pk)
      } finally {
        setFetching(false)
      }
    },
    [
      user.organisation.pk,
      fetchDefaultInviteesMeta,
    ],
  )

  useEffect(() => {
    setFetching(true)
    getInvitees()
  }, [getInvitees])

  if (fetching) {
    return (
      <Spin.Centered
        size={ComponentSize.SMALL}
        spinning
      />
    )
  }

  return localize(Localization.INVITED, { count: inviteesDefaultMeta?.total })
}

InviteesTabTitle.propTypes = {
  user: userShape.isRequired,
  fetchDefaultInviteesMeta: PropTypes.func.isRequired,
  inviteesDefaultMeta: PropTypes.shape({
    total: PropTypes.number,
    size: PropTypes.number,
  }),
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
  inviteesDefaultMeta: orgDefaultInviteesMetaSelector(state),
})

const mapDispatchToProps = {
  fetchDefaultInviteesMeta,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(InviteesTabTitle)

export { ConnectedComponent as InviteesTabTitle }
