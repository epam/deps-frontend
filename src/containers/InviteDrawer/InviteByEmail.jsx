
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import {
  fetchInvitedUsersByFilter,
  fetchWaitingForApprovalUsersByFilter,
} from '@/actions/orgUserManagement'
import {
  fetchDefaultInviteesMeta,
  fetchDefaultWaitingsMeta,
} from '@/actions/orgUserManagementPage'
import { iamApi } from '@/api/iamApi'
import { Button, ButtonType } from '@/components/Button'
import { EmailsListIcon } from '@/components/Icons/EmailsListIcon'
import { PlusIcon } from '@/components/Icons/PlusIcon'
import { Input } from '@/components/Input'
import { Tag } from '@/components/Tag'
import { Tooltip } from '@/components/Tooltip'
import { EMAIL_REGEXP, EMAIL_LIST_REGEXP } from '@/constants/regexp'
import { Placement } from '@/enums/Placement'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { notifyRequest, notifyWarning } from '@/utils/notification'
import { EmailListDrawer } from './EmailListDrawer'
import {
  InputWrapper,
  InviteWrapper,
  ControlWrapper,
  ButtonsWrapper,
  StyledListEmailsButton,
  StyledAddEmailButton,
  EmailsList,
  Hint,
} from './InviteByEmail.styles'

const InviteByEmail = ({
  fetchInvitedUsersByFilter,
  fetchDefaultInviteesMeta,
  fetchDefaultWaitingsMeta,
  fetchWaitingForApprovalUsersByFilter,
  onClose,
  user,
  refetchUsers,
}) => {
  const [emails, setEmails] = useState([])
  const [email, setMail] = useState('')
  const [isInvalid, setIsInvalid] = useState(true)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const handleChange = (e) => {
    setMail(e.target.value)

    setIsInvalid(!EMAIL_REGEXP.test(e.target.value))
  }

  const addEmail = () => {
    if (!emails.includes(email)) {
      setEmails((prev) => [...prev, email])
    }

    setMail('')
    setIsInvalid(true)
  }

  const deleteEmailFromList = (email) => {
    setEmails((prev) => prev.filter((el) => email !== el))
  }

  const deleteAllEmailsFromList = () => {
    setEmails('')
  }

  const addEmailList = (emailList) => {
    setEmails((prev) => [...new Set(
      [
        ...prev,
        ...Array.from(emailList.matchAll(EMAIL_LIST_REGEXP), ([match]) => match),
      ]),
    ])
  }

  const isSendInviteDisabled = !(emails.length || !isInvalid)

  const emailButtonTooltip = !isInvalid
    ? localize(Localization.ADD_EMAIL_TO_LIST)
    : localize(Localization.VALIDATE_EMAIL_FAIL)

  const onEmailDoubleClick = (email) => {
    deleteEmailFromList(email)
    setMail(email)
    setIsInvalid(false)
  }

  const sendInvite = useCallback(async () => {
    try {
      const emailsToSend = emails.map((email) => ({ email }))

      if (EMAIL_REGEXP.test(email)) {
        emailsToSend.push({ email })
      }

      await notifyRequest(iamApi.inviteUsers(emailsToSend, user.organisation.pk))({
        fetching: localize(Localization.SENDING_INVITE),
        success: localize(Localization.SEND_INVITE_SUCCESSFUL),
      })

      await Promise.all([
        fetchInvitedUsersByFilter(user.organisation.pk),
        fetchWaitingForApprovalUsersByFilter(user.organisation.pk),
        fetchDefaultInviteesMeta(user.organisation.pk),
        fetchDefaultWaitingsMeta(user.organisation.pk),
      ])

      refetchUsers()
    } catch (error) {
      error.response?.status === StatusCode.CONFLICT
        ? notifyWarning(localize(Localization.DUPLICATED_INVITE))
        : notifyWarning(localize(Localization.SENDING_INVITE_ERROR))
    } finally {
      setIsInvalid(true)
      setEmails([])
      setMail('')
      onClose()
    }
  }, [
    emails,
    email,
    user.organisation.pk,
    fetchInvitedUsersByFilter,
    fetchWaitingForApprovalUsersByFilter,
    fetchDefaultInviteesMeta,
    fetchDefaultWaitingsMeta,
    refetchUsers,
    onClose,
  ])

  return (
    <>
      <InviteWrapper>
        <ControlWrapper>
          <Tooltip title={localize(Localization.ADD_EMAIL_LIST)}>
            <StyledListEmailsButton
              onClick={() => setIsDrawerVisible(true)}
            >
              <EmailsListIcon />
            </StyledListEmailsButton>
          </Tooltip>
          <InputWrapper>
            <Input
              onChange={handleChange}
              placeholder={localize(Localization.INVITE_PLACEHOLDER)}
              value={email}
            />
          </InputWrapper>
          <Tooltip
            placement={Placement.TOP_LEFT}
            title={emailButtonTooltip}
          >
            <StyledAddEmailButton
              disabled={isInvalid}
              onClick={addEmail}
            >
              <PlusIcon />
            </StyledAddEmailButton>
          </Tooltip>
        </ControlWrapper>
        {
          !!emails.length && (
            <EmailsList>
              {
                emails.map((email) => (
                  <Tag
                    key={email}
                    onClose={() => deleteEmailFromList(email)}
                    onDoubleClick={() => onEmailDoubleClick(email)}
                  >
                    {email}
                  </Tag>
                ))
              }
            </EmailsList>
          )
        }
        {
          !!emails.length && (
            <Hint>
              {localize(Localization.EDIT_EMAIL_HINT)}
            </Hint>
          )
        }
        <ButtonsWrapper>
          <Button
            disabled={isSendInviteDisabled}
            onClick={sendInvite}
            type={ButtonType.PRIMARY}
          >
            {localize(Localization.SEND_INVITE)}
          </Button>
          {
            !!emails.length && (
              <Button
                onClick={deleteAllEmailsFromList}
                type={ButtonType.LINK}
              >
                {localize(Localization.CLEAR_ALL)}
              </Button>
            )
          }
        </ButtonsWrapper>
      </InviteWrapper>
      <EmailListDrawer
        addContent={addEmailList}
        closeDrawer={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      />
    </>
  )
}

InviteByEmail.propTypes = {
  fetchDefaultInviteesMeta: PropTypes.func.isRequired,
  fetchInvitedUsersByFilter: PropTypes.func.isRequired,
  fetchDefaultWaitingsMeta: PropTypes.func.isRequired,
  fetchWaitingForApprovalUsersByFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  user: userShape.isRequired,
  refetchUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, {
  fetchInvitedUsersByFilter,
  fetchWaitingForApprovalUsersByFilter,
  fetchDefaultInviteesMeta,
  fetchDefaultWaitingsMeta,
})(InviteByEmail)

export {
  ConnectedComponent as InviteByEmail,
}
