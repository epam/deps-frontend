
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
  useMemo,
} from 'react'
import { Button, ButtonType } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { PenIcon } from '@/components/Icons/PenIcon'
import { SettingsIcon } from '@/components/Icons/SettingsIcon'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Field } from '@/containers/PromptCalibrationStudio/viewModels'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { LLMExtractorDescription } from './LLMExtractorDescription'
import {
  ContentHeader,
  ContentWrapper,
  DrawerFooterWrapper,
  LLMExtractorButton,
  StyledIconButton,
} from './LLMExtractorDrawer.styles'
import { LLMExtractorsDropdown } from './LLMExtractorsDropdown'
import { ManageLLMExtractorDrawer } from './ManageLLMExtractorDrawer'

const CREATE_MODE_KEY = 'create'

export const LLMExtractorDrawer = ({ onExecute }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [currentExtractor, setCurrentExtractor] = useState(null)
  const [isManageDrawerVisible, setIsManageDrawerVisible] = useState(false)
  const [extractorToEdit, setExtractorToEdit] = useState(null)

  const {
    extractors,
    activeField,
    setActiveField,
    updateFields,
  } = useFieldCalibration()

  const onExtractorChange = useCallback((extractorId) => {
    const extractor = extractors.find((extractor) => extractor.id === extractorId)
    setCurrentExtractor(extractor)
  }, [extractors])

  const onCloseModal = useCallback(() => {
    setCurrentExtractor(null)
    setIsDrawerVisible(false)
  }, [])

  const onOpenManageDrawer = useCallback((extractor = null) => {
    setExtractorToEdit(extractor)
    setIsManageDrawerVisible(true)
  }, [])

  const onCloseManageDrawer = useCallback(() => {
    setExtractorToEdit(null)
    setIsManageDrawerVisible(false)
  }, [])

  const onOpenModal = useCallback(() => {
    const extractor = extractors.find((extractor) => extractor.id === activeField.extractorId)
    setCurrentExtractor(extractor)
    setIsDrawerVisible(true)
  }, [
    extractors,
    activeField.extractorId,
  ])

  const updateFieldExtractor = useCallback(() => {
    const updatedField = Field.updateExtractor(activeField, currentExtractor.id)
    setActiveField(updatedField)
    updateFields(updatedField)
    onCloseModal()
  }, [
    activeField,
    currentExtractor?.id,
    setActiveField,
    updateFields,
    onCloseModal,
  ])

  const onSubmitHandler = useCallback(() => {
    const nodes = activeField.query.nodes

    updateFieldExtractor()

    nodes.length && onExecute({
      nodes,
      extractor: currentExtractor,
    })
  }, [
    activeField.query.nodes,
    onExecute,
    currentExtractor,
    updateFieldExtractor,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <Button.Secondary onClick={onCloseModal}>
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={currentExtractor?.id === activeField.extractorId}
        onClick={onSubmitHandler}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SUBMIT)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    onCloseModal,
    currentExtractor?.id,
    activeField.extractorId,
    onSubmitHandler,
  ])

  const renderDrawerContent = useCallback(() => (
    <ContentWrapper>
      <ContentHeader>
        <LLMExtractorsDropdown
          onCreateExtractor={onOpenManageDrawer}
          onSelectExtractor={onExtractorChange}
          selectedExtractor={currentExtractor}
        />
        <StyledIconButton
          icon={<PenIcon />}
          onClick={() => onOpenManageDrawer(currentExtractor)}
        />
      </ContentHeader>
      <LLMExtractorDescription extractor={currentExtractor} />
    </ContentWrapper>
  ), [
    currentExtractor,
    onExtractorChange,
    onOpenManageDrawer,
  ])

  return (
    <>
      <LLMExtractorButton onClick={onOpenModal}>
        <SettingsIcon />
        {localize(Localization.LLM_EXTRACTOR)}
      </LLMExtractorButton>
      <Drawer
        destroyOnClose
        footer={DrawerFooter}
        getContainer={() => document.body}
        hasCloseIcon={false}
        onClose={onCloseModal}
        open={isDrawerVisible}
        title={localize(Localization.LLM_EXTRACTOR)}
        width={theme.size.drawerWidth}
      >
        {!!currentExtractor && renderDrawerContent()}
      </Drawer>
      <ManageLLMExtractorDrawer
        key={extractorToEdit?.id || CREATE_MODE_KEY}
        extractor={extractorToEdit}
        isVisible={isManageDrawerVisible}
        onClose={onCloseManageDrawer}
        onExecute={onExecute}
        setExtractor={setCurrentExtractor}
      />
    </>
  )
}

LLMExtractorDrawer.propTypes = {
  onExecute: PropTypes.func.isRequired,
}
