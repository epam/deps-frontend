
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
  useState,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, ButtonType } from '@/components/Button'
import { FormValidationMode } from '@/components/Form/ReactHookForm'
import { useFieldCalibration, useManageExtractor } from '@/containers/PromptCalibrationStudio/hooks'
import { extractorShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { DefaultValues } from './constants'
import {
  StyledDrawer,
  DrawerFooterWrapper,
} from './ManageLLMExtractorDrawer.styles'
import { ManageLLMExtractorForm } from './ManageLLMExtractorForm'
import { SaveExtractorModal } from './SaveExtractorModal'

const getDefaultValues = (extractor) => {
  if (extractor) {
    const { id, ...restValues } = extractor
    return restValues
  }

  return DefaultValues
}

export const ManageLLMExtractorDrawer = ({
  isVisible,
  extractor,
  setExtractor,
  onClose,
  onExecute,
}) => {
  const { activeField } = useFieldCalibration()

  const {
    updateExtractorForAllFields,
    updateExtractorForActiveField,
    createNewExtractor,
    isRetrievingInsights,
  } = useManageExtractor()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const methods = useForm({
    mode: FormValidationMode.ON_CHANGE,
    shouldUnregister: true,
    defaultValues: getDefaultValues(extractor),
  })

  const {
    getValues,
    formState: {
      isValid,
      isDirty,
    },
  } = methods

  const drawerTitle = (
    extractor
      ? localize(Localization.EDIT_LLM_EXTRACTOR)
      : localize(Localization.ADD_LLM_EXTRACTOR)
  )

  const toggleModalVisibility = useCallback(() => {
    setIsModalVisible((prevIsModalVisible) => !prevIsModalVisible)
  }, [])

  const updateExistingExtractor = async () => {
    const newExtractor = await updateExtractorForAllFields(getValues(), extractor.id)

    setExtractor(newExtractor)

    const nodes = activeField.query.nodes
    const shouldExecute = nodes.length && activeField.extractorId === newExtractor.id

    if (shouldExecute) {
      onExecute({
        nodes,
        extractor: newExtractor,
      })
    }

    toggleModalVisibility()
    onClose()
  }

  const createNewExtractorForField = () => {
    const newExtractor = updateExtractorForActiveField(getValues())

    setExtractor(newExtractor)

    const nodes = activeField.query.nodes

    if (nodes.length) {
      onExecute({
        nodes,
        extractor: newExtractor,
      })
    }

    toggleModalVisibility()
    onClose()
  }

  const createExtractor = useCallback(() => {
    const newExtractor = createNewExtractor(getValues())

    setExtractor(newExtractor)
    onClose()
  }, [
    getValues,
    setExtractor,
    onClose,
    createNewExtractor,
  ])

  const onSave = useCallback(() => {
    if (extractor) {
      toggleModalVisibility()
    } else {
      createExtractor()
    }
  }, [
    extractor,
    toggleModalVisibility,
    createExtractor,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <Button.Secondary onClick={onClose}>
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={!isValid || !isDirty}
        onClick={onSave}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    onClose,
    isValid,
    isDirty,
    onSave,
  ])

  return (
    <>
      <StyledDrawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={onClose}
        open={isVisible}
        title={drawerTitle}
        width={theme.size.drawerWidth}
      >
        <FormProvider {...methods}>
          <ManageLLMExtractorForm extractor={extractor} />
        </FormProvider>
      </StyledDrawer>
      <SaveExtractorModal
        isLoading={isRetrievingInsights}
        isVisible={isModalVisible}
        onClose={toggleModalVisibility}
        onCreateNew={createNewExtractorForField}
        onEditExisting={updateExistingExtractor}
      />
    </>
  )
}

ManageLLMExtractorDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  extractor: extractorShape,
  setExtractor: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onExecute: PropTypes.func.isRequired,
}
