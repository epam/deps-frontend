
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
} from 'react'
import { Dropdown } from '@/components/Dropdown'
import { MenuTrigger } from '@/components/Menu'
import { Placement } from '@/enums/Placement'
import { llmSettingsShape, llmProviderShape } from '@/models/LLMProvider'
import {
  CloseIcon,
  ExpandIcon,
  Collapse,
  Panel,
  ItemWrapper,
  Model,
  Provider,
  StyledIconButton,
} from './LLMSettingsDropdown.styles'

const isActiveItem = (llmSettings, provider, model) =>
  llmSettings.provider === provider.code && llmSettings.model === model.code

const LLMSettingsDropdown = ({
  activeLLMSettings,
  disabled,
  isVisible,
  onVisibleChange,
  onModelSelect,
  providers,
  renderTrigger,
}) => {
  const mappedProviders = useMemo(() => providers.map((provider) => {
    const mappedModels = provider.models
      .map((model) => ({
        ...model,
        isActive: isActiveItem(activeLLMSettings, provider, model),
      }))

    const activeModel = mappedModels.find((model) => model.isActive)
    const inactiveModels = mappedModels.filter((model) => !model.isActive)

    return {
      ...provider,
      models: activeModel ? [activeModel, ...inactiveModels] : inactiveModels,
    }
  }), [activeLLMSettings, providers])

  const getPanelHeader = useCallback((provider) => {
    const model = provider.models[0]

    return (
      <ItemWrapper
        onClick={() => onModelSelect(provider.code, model.code)}
      >
        <Model $isActive={model.isActive}>
          {model.name}
        </Model>
        <Provider $isActive={model.isActive}>
          {provider.name}
        </Provider>
      </ItemWrapper>
    )
  }, [onModelSelect])

  const getExpandedView = useCallback((provider) => {
    const models = provider.models.slice(1)

    return (
      <>
        {
          models.map((model) => (
            <ItemWrapper
              key={model.code}
              onClick={() => onModelSelect(provider.code, model.code)}
            >
              <Model $isActive={model.isActive}>
                {model.name}
              </Model>
            </ItemWrapper>
          ),
          )
        }
      </>
    )
  }, [onModelSelect])

  const renderExpandButton = useCallback((panelProps, onClick) => (
    <StyledIconButton
      icon={panelProps.isActive ? <CloseIcon /> : <ExpandIcon />}
      onClick={onClick}
    />
  ), [])

  const renderPanels = useCallback(() => mappedProviders.map((provider) => (
    <Panel
      key={provider.code}
      header={getPanelHeader(provider)}
    >
      {getExpandedView(provider)}
    </Panel>
  )), [
    getExpandedView,
    getPanelHeader,
    mappedProviders,
  ])

  const renderDropdownContent = () => (
    <Collapse
      renderExpandButton={renderExpandButton}
      renderPanels={renderPanels}
    />
  )

  return (
    <Dropdown
      disabled={disabled}
      dropdownRender={renderDropdownContent}
      onOpenChange={onVisibleChange}
      open={isVisible}
      placement={Placement.BOTTOM_RIGHT}
      trigger={MenuTrigger.CLICK}
    >
      {renderTrigger()}
    </Dropdown>
  )
}

LLMSettingsDropdown.propTypes = {
  activeLLMSettings: llmSettingsShape,
  disabled: PropTypes.bool,
  isVisible: PropTypes.bool,
  onVisibleChange: PropTypes.func.isRequired,
  onModelSelect: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(llmProviderShape).isRequired,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  LLMSettingsDropdown,
}
