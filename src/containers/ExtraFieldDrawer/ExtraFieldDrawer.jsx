
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { ButtonType } from '@/components/Button'
import { Tooltip } from '@/components/Tooltip'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { documentSupplementShape } from '@/models/DocumentSupplement'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { theme } from '@/theme/theme.default'
import {
  Button,
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
  Title,
} from './ExtraFieldDrawer.styles'
import { ExtraFieldName } from './ExtraFieldName'
import { ExtraFieldType } from './ExtraFieldType'

const ExtraFieldDrawer = ({
  field,
  setField,
  isLoading,
  isFieldCreationMode,
  onSubmit,
  closeDrawer,
  visible,
}) => {
  const onClose = useCallback(() => {
    closeDrawer()
  }, [closeDrawer])

  const saveField = useCallback(() => {
    const normalizedField = {
      ...field,
      name: field.name.trim(),
    }
    onSubmit(normalizedField)
  }, [
    field,
    onSubmit,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={onClose}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={!field.name}
        loading={isLoading}
        onClick={saveField}
        type={ButtonType.PRIMARY}
      >
        {
          isFieldCreationMode
            ? localize(Localization.CREATE)
            : localize(Localization.SUBMIT)
        }
      </Button>
    </DrawerFooterWrapper>
  ), [
    isLoading,
    isFieldCreationMode,
    onClose,
    saveField,
    field.name,
  ])

  const DrawerTitle = useMemo(() => (
    <Title>
      {
        isFieldCreationMode
          ? localize(Localization.ADD_EXTRA_FIELD)
          : localize(Localization.EDIT_EXTRA_FIELD)
      }
    </Title>
  ), [isFieldCreationMode])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={onClose}
      open={visible}
      title={DrawerTitle}
      width={theme.size.drawerWidth}
    >
      <ExtraFieldName
        name={field.name}
        updateField={setField}
      />
      <Tooltip
        placement={Placement.BOTTOM}
        title={localize(Localization.DISABLED_FIELD_TYPE_TOOLTIP)}
      >
        <ExtraFieldType
          type={field.type}
        />
      </Tooltip>
    </Drawer>
  )
}

ExtraFieldDrawer.propTypes = {
  field: PropTypes.oneOfType([
    documentTypeExtraFieldShape,
    documentSupplementShape,
  ]).isRequired,
  setField: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isFieldCreationMode: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}

export {
  ExtraFieldDrawer,
}
