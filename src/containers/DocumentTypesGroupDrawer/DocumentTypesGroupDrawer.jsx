
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { ButtonType, Button } from '@/components/Button'
import { FormValidationMode } from '@/components/Form'
import { Spin } from '@/components/Spin'
import { Localization, localize } from '@/localization/i18n'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { theme } from '@/theme/theme.default'
import {
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
  Title,
} from './DocumentTypesGroupDrawer.styles'
import { DocumentTypesGroupForm } from './DocumentTypesGroupForm'

const DocumentTypesGroupDrawer = ({
  isLoading,
  onSave,
  closeDrawer,
  visible,
}) => {
  const documentTypes = useSelector(documentTypesSelector)
  const areDocumentTypesFetching = useSelector(areTypesFetchingSelector)

  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
  })

  const {
    getValues,
    formState: {
      isValid,
    },
  } = methods

  const saveGroup = useCallback(() => {
    onSave(getValues())
  }, [
    getValues,
    onSave,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={closeDrawer}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={!isValid}
        loading={isLoading}
        onClick={saveGroup}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    isLoading,
    closeDrawer,
    isValid,
    saveGroup,
  ])

  const DrawerTitle = useMemo(() => (
    <Title>
      {localize(Localization.ADD_GROUP)}
    </Title>
  ), [])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={visible}
      title={DrawerTitle}
      width={theme.size.drawerWidth}
    >
      <Spin spinning={isLoading || areDocumentTypesFetching}>
        <FormProvider {...methods}>
          <DocumentTypesGroupForm documentTypes={documentTypes} />
        </FormProvider>
      </Spin>
    </Drawer>
  )
}

DocumentTypesGroupDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
}

export {
  DocumentTypesGroupDrawer,
}
