
import PropTypes from 'prop-types'
import { PrototypeFields } from '@/containers/PrototypeFields'
import { PrototypeReferenceLayout } from '@/containers/PrototypeReferenceLayout'
import { PrototypeTables } from '@/containers/PrototypeTables'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { prototypeFieldShape } from '@/models/PrototypeField'
import { prototypeTableFieldShape } from '@/models/PrototypeTableField'
import { ENV } from '@/utils/env'
import {
  Column,
  Wrapper,
} from './PrototypeData.styles'

const fieldsColumnsCount = ENV.FEATURE_PROTOTYPE_REFERENCE_LAYOUT ? 1 : 2

const PrototypeData = ({
  addField,
  regularFields,
  tableFields,
  fieldsViewType,
  isEditMode,
  prototypeId,
  removeField,
  checkIfFieldIsSaved,
  toggleEditMode,
  updateField,
}) => (
  <Wrapper>
    {
      ENV.FEATURE_PROTOTYPE_REFERENCE_LAYOUT && (
        <Column>
          <PrototypeReferenceLayout
            addField={addField}
            fieldsViewType={fieldsViewType}
            isEditMode={isEditMode}
            prototypeFields={regularFields}
            prototypeId={prototypeId}
          />
        </Column>
      )
    }
    <Column singleColumn={!ENV.FEATURE_PROTOTYPE_REFERENCE_LAYOUT}>
      {
        fieldsViewType === PrototypeViewType.FIELDS
          ? (
            <PrototypeFields
              addField={addField}
              checkIfFieldIsSaved={checkIfFieldIsSaved}
              fields={regularFields}
              fieldsColumnsCount={fieldsColumnsCount}
              isEditMode={isEditMode}
              removeField={removeField}
              toggleEditMode={toggleEditMode}
              updatePrototypeField={updateField}
            />
          )
          : (
            <PrototypeTables
              addField={addField}
              fields={tableFields}
              fieldsColumnsCount={fieldsColumnsCount}
              isEditMode={isEditMode}
              removeField={removeField}
              toggleEditMode={toggleEditMode}
              updateField={updateField}
            />
          )
      }
    </Column>
  </Wrapper>
)

PrototypeData.propTypes = {
  addField: PropTypes.func.isRequired,
  regularFields: PropTypes.arrayOf(
    prototypeFieldShape.isRequired,
  ).isRequired,
  tableFields: PropTypes.arrayOf(
    prototypeTableFieldShape.isRequired,
  ).isRequired,
  fieldsViewType: PropTypes.oneOf(
    Object.values(PrototypeViewType),
  ).isRequired,
  checkIfFieldIsSaved: PropTypes.func,
  isEditMode: PropTypes.bool.isRequired,
  prototypeId: PropTypes.string,
  removeField: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func,
  updateField: PropTypes.func.isRequired,
}

export {
  PrototypeData,
}
