
import { useMemo } from 'react'
import { connect } from 'react-redux'
import {
  Form,
  FormFieldType,
  FormItem,
  MaxLengthValidator,
  RequiredValidator,
} from '@/components/Form/ReactHookForm'
import { Localization, localize } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { StyledLabel } from './ChangeOrgNameFormButton.styles'

const FIELDS_CODE = {
  prevOrganisationName: 'prevName',
  newOrganisationName: 'newName',
}

const MAX_INPUT_LENGTH = 50

const ChangeOrganisationForm = ({ user }) => {
  const fields = useMemo(() => [
    {
      code: FIELDS_CODE.prevOrganisationName,
      label: (
        <StyledLabel>
          {localize(Localization.CURRENT_NAME)}
        </StyledLabel>
      ),
      type: FormFieldType.STRING,
      defaultValue: user.organisation.name,
      disabled: true,
    },
    {
      code: FIELDS_CODE.newOrganisationName,
      label: (
        <StyledLabel>
          {localize(Localization.UPDATED_NAME)}
        </StyledLabel>
      ),
      type: FormFieldType.STRING,
      rules: {
        ...new MaxLengthValidator(MAX_INPUT_LENGTH, localize(Localization.MAX_LENGTH_ORGANISATION_NAME_VALIDATOR_ERROR_MESSAGE)),
        ...new RequiredValidator(localize(Localization.EMPTY_ORGANISATION_NAME_VALIDATOR_ERROR_MESSAGE)),
      },
    },
  ], [user.organisation.name])

  const BaseFormSection = useMemo(() => (
    fields.map(({ label, ...field }) => (
      <FormItem
        key={field.code}
        field={field}
        label={label}
      />
    ))
  ), [fields])

  return (
    <Form>
      {BaseFormSection}
    </Form>
  )
}

ChangeOrganisationForm.propTypes = {
  user: userShape,
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(ChangeOrganisationForm)

export {
  ConnectedComponent as ChangeOrganisationForm,
  FIELDS_CODE,
}
