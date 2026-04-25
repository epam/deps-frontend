
import {
  useState,
  useMemo,
  useCallback,
} from 'react'
import { ButtonType } from '@/components/Button'
import { List } from '@/components/List'
import { Tooltip } from '@/components/Tooltip'
import { CreateAiPromptedExtractorDrawer } from '@/containers/CreateAiPromptedExtractorDrawer'
import { CreateAzureExtractorDrawer } from '@/containers/CreateAzureExtractorDrawer'
import { CreateTemplateDrawer } from '@/containers/CreateTemplateDrawer'
import { ExtractionType } from '@/enums/ExtractionType'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import {
  DocTypeModal,
  ListItem,
  Title,
  Description,
  DisabledListItem,
  NewPlusIcon,
  TriggerButton,
} from './AddDocumentTypeModalButton.styles'

const EXTRACTION_TYPE_TO_CONTENT = {
  [ExtractionType.TEMPLATE]: {
    title: localize(Localization.TEMPLATE),
    description: localize(Localization.TEMPLATE_DESCRIPTION),
  },
  [ExtractionType.PROTOTYPE]: {
    title: localize(Localization.PROTOTYPE),
    description: localize(Localization.PROTOTYPE_DESCRIPTION),
  },
  [ExtractionType.ML]: {
    title: localize(Localization.CUSTOM_MODEL),
    description: localize(Localization.CUSTOM_MODEL_DESCRIPTION),
  },
  [ExtractionType.AZURE_CLOUD_EXTRACTOR]: {
    title: localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR),
    description: localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR_DESCRIPTION),
  },
  [ExtractionType.AI_PROMPTED]: {
    title: localize(Localization.AI_PROMPTED),
    description: localize(Localization.AI_PROMPTED_DESCRIPTION),
  },
}

const renderListItemContent = (type) => (
  <>
    <Title>
      {EXTRACTION_TYPE_TO_CONTENT[type].title}
    </Title>
    <Description>
      {EXTRACTION_TYPE_TO_CONTENT[type].description}
    </Description>
  </>
)

const MODAL_WIDTH = 320

const AddDocumentTypeModalButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleModal = () => {
    setIsVisible((prevIsVisible) => !prevIsVisible)
  }

  const handleItemClick = useCallback((key) => {
    if (key === ExtractionType.PROTOTYPE) {
      goTo(navigationMap.prototypes.createPrototype())
      return
    }

    setIsVisible(false)
  }, [])

  const ModalContent = useMemo(() => (
    <List>
      {
        ENV.FEATURE_AI_PROMPTED_EXTRACTORS && (
          <ListItem onClick={() => handleItemClick(ExtractionType.AI_PROMPTED)}>
            <CreateAiPromptedExtractorDrawer>
              {renderListItemContent(ExtractionType.AI_PROMPTED)}
            </CreateAiPromptedExtractorDrawer>
          </ListItem>
        )
      }
      {
        ENV.FEATURE_AZURE_CLOUD_NATIVE_EXTRACTOR && (
          <ListItem onClick={() => handleItemClick(ExtractionType.AZURE_CLOUD_EXTRACTOR)}>
            <CreateAzureExtractorDrawer>
              {renderListItemContent(ExtractionType.AZURE_CLOUD_EXTRACTOR)}
            </CreateAzureExtractorDrawer>
          </ListItem>
        )
      }
      {
        ENV.FEATURE_PROTOTYPES && (
          <ListItem onClick={() => handleItemClick(ExtractionType.PROTOTYPE)}>
            {renderListItemContent(ExtractionType.PROTOTYPE)}
          </ListItem>
        )
      }
      {
        ENV.FEATURE_TEMPLATES && (
          <ListItem onClick={() => handleItemClick(ExtractionType.TEMPLATE)}>
            <CreateTemplateDrawer>
              {renderListItemContent(ExtractionType.TEMPLATE)}
            </CreateTemplateDrawer>
          </ListItem>
        )
      }
      <Tooltip title={localize(Localization.CUSTOM_MODEL_TOOLTIP)}>
        <DisabledListItem>
          {renderListItemContent(ExtractionType.ML)}
        </DisabledListItem>
      </Tooltip>
    </List>
  ), [handleItemClick])

  return (
    <>
      <TriggerButton
        $focused={isVisible}
        onClick={toggleModal}
        type={ButtonType.PRIMARY}
      >
        <NewPlusIcon />
        {localize(Localization.ADD_DOC_TYPE)}
      </TriggerButton>
      <DocTypeModal
        footer={null}
        onCancel={toggleModal}
        open={isVisible}
        title={localize(Localization.SELECT_DOCUMENT_TYPE)}
        width={MODAL_WIDTH}
      >
        {ModalContent}
      </DocTypeModal>
    </>
  )
}

export { AddDocumentTypeModalButton }
