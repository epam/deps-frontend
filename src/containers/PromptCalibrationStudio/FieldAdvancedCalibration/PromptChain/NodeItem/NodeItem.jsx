
import PropTypes from 'prop-types'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { Modal } from '@/components/Modal'
import { getTooltipConfig } from '@/containers/BatchFilesSplittingDrawer/utils'
import { queryNodeShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Name,
  ContentWrapper,
  Prompt,
  StyledIconButton,
  PromptNumber,
  ActionsWrapper,
} from './NodeItem.styles'

export const NodeItem = ({
  node,
  onDelete,
  onEdit,
  isDeleteHidden,
  promptNumber,
}) => {
  const handleDeleteButtonClick = () => {
    Modal.confirm({
      title: localize(Localization.DELETE_PROMPT_CONFIRM_TITLE),
      onOk: () => onDelete(node.id),
    })
  }

  const handleEditButtonClick = () => onEdit(node.id)

  return (
    <Wrapper>
      <PromptNumber>{promptNumber}</PromptNumber>
      <ContentWrapper>
        <Name
          key={`name-${node.name}`}
          text={node.name}
        />
        <Prompt
          key={`prompt-${node.prompt}`}
          text={node.prompt}
        />
      </ContentWrapper>
      <ActionsWrapper>
        <StyledIconButton
          icon={<PenIcon />}
          onClick={handleEditButtonClick}
          tooltip={getTooltipConfig(localize(Localization.EDIT_PROMPT))}
        />
        {
          !isDeleteHidden && (
            <StyledIconButton
              icon={<TrashIcon />}
              onClick={handleDeleteButtonClick}
              tooltip={getTooltipConfig(localize(Localization.DELETE_PROMPT))}
            />
          )
        }
      </ActionsWrapper>
    </Wrapper>
  )
}

NodeItem.propTypes = {
  node: queryNodeShape.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isDeleteHidden: PropTypes.bool,
  promptNumber: PropTypes.number.isRequired,
}
