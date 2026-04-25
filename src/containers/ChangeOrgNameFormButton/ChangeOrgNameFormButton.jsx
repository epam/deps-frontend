
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { connect } from 'react-redux'
import { changeOrgName } from '@/actions/organisations'
import { FormValidationMode } from '@/components/Form/ReactHookForm'
import { ModalButton } from '@/components/ModalButton'
import { Localization, localize } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { notifyRequest } from '@/utils/notification'
import { ChangeOrganisationForm, FIELDS_CODE } from './ChangeOrganisationForm'
import { StyledButton, StyledLabel } from './ChangeOrgNameFormButton.styles'

const ChangeOrgNameFormButton = ({
  changeOrgName,
  user,
}) => {
  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
  })
  const {
    getValues,
    formState: {
      isValid,
      isDirty,
    },
  } = methods

  const renderOpenButton = (open) => (
    <StyledButton
      onClick={open}
    >
      {localize(Localization.CHANGE_ORGANISATION_NAME)}
    </StyledButton>
  )

  const saveOrganisationName = useCallback(async () => {
    await notifyRequest(changeOrgName(user.organisation.pk, getValues()[FIELDS_CODE.newOrganisationName]))({
      fetching: localize(Localization.ORGANISATION_NAME_CHANGING),
      success: localize(Localization.ORGANISATION_NAME_CHANGE_SUCCESS),
      warning: localize(Localization.ORGANISATION_NAME_CHANGE_ERROR),
    })
  }, [
    changeOrgName,
    getValues,
    user,
  ])

  const okButtonProps = useMemo(() => ({
    text: localize(Localization.SUBMIT),
    disabled: !isDirty || !isValid,
  }), [
    isDirty,
    isValid,
  ])

  return (
    <ModalButton
      okButtonProps={okButtonProps}
      onOk={saveOrganisationName}
      renderOpenTrigger={renderOpenButton}
      title={
        (
          <StyledLabel>
            {localize(Localization.CHANGE_ORGANISATION_NAME)}
          </StyledLabel>
        )
      }
    >
      <FormProvider {...methods}>
        <ChangeOrganisationForm />
      </FormProvider>
    </ModalButton>
  )
}

ChangeOrgNameFormButton.propTypes = {
  changeOrgName: PropTypes.func.isRequired,
  user: userShape,
}

const mapDispatchToProps = {
  changeOrgName,
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(ChangeOrgNameFormButton)

export {
  ConnectedComponent as ChangeOrgNameFormButton,
}
