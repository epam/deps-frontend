
import PropTypes from 'prop-types'
import { Tooltip } from '@/components/Tooltip'
import { queryNodeShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import {
  SinglePromptText,
  NodePrompt,
  NodeName,
  ContentWrapper,
  Wrapper,
  WarningTriangleIcon,
  MicrochipIcon,
  MapIcon,
} from './NodesPreview.styles'

export const NodesPreview = ({ nodes }) => {
  const renderTitle = () => {
    if (!nodes.length) {
      return localize(Localization.GEN_AI_FIELD_WITHOUT_PROMPTS_MESSAGE)
    }

    if (nodes.length === 1) {
      return (
        <SinglePromptText>
          {nodes[0].prompt}
        </SinglePromptText>
      )
    }

    return (
      <Wrapper>
        {
          nodes.map((item, index) => (
            <div key={item.id}>
              <NodeName>{`${index + 1}. ${item.name}`}</NodeName>
              <NodePrompt>{item.prompt}</NodePrompt>
            </div>
          ))
        }
      </Wrapper>
    )
  }

  const renderContent = () => {
    if (!nodes.length) {
      return <WarningTriangleIcon />
    }

    if (nodes.length === 1) {
      return <MicrochipIcon />
    }

    return <MapIcon />
  }

  return (
    <Tooltip title={renderTitle()}>
      <ContentWrapper>
        {renderContent()}
      </ContentWrapper>
    </Tooltip>
  )
}

NodesPreview.propTypes = {
  nodes: PropTypes.arrayOf(queryNodeShape).isRequired,
}
