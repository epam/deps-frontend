
import styled, { css } from 'styled-components'
import { MentionsField } from '@/components/MentionsField'
import { Tooltip } from '@/components/Tooltip'

const RuleInput = styled(MentionsField)`
  height: 100%;

  .mentions {
    height: 100%;
    
    &__input {
      padding: 1.6rem;
      
      ${(props) => props.$hasRequiredMark && css`
        padding-left: 2.2rem;
      `}
    }

    &__highlighter {
      padding: 1.6rem;
    }
  }

  .mentions__suggestions {
    min-width: 48rem;
  }

  .mentions__suggestions__item {
    width: 100%;
    box-sizing: border-box;
  }
`

const InputTooltip = styled(Tooltip)`
  position: relative;
  height: 100%;
  width: 100%;
`

const RequiredMark = styled.span`
  position: absolute;
  left: 1rem;
  top: 2rem;
  display: inline-block;
  color: ${(props) => props.theme.color.errorDark};
  line-height: 1;
  pointer-events: none;
`

const SuggestionWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  min-width: 0;
`

const SuggestionType = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.color.textSecondary};
`

const SuggestionIcon = styled.span`
  display: flex;
`

export {
  RuleInput,
  InputTooltip,
  RequiredMark,
  SuggestionWrapper,
  SuggestionType,
  SuggestionIcon,
}
