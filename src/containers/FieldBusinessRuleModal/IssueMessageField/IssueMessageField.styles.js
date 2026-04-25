
import styled from 'styled-components'
import { MentionsField } from '@/components/MentionsField'

const StyledMentionsField = styled(MentionsField)`
  .mentions {
    height: 16rem;
  }

  .mentions__suggestions {
    min-width: 48rem;
  }

  .mentions__suggestions__item {
    width: 100%;
    box-sizing: border-box;
  }
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
  StyledMentionsField as Input,
  SuggestionWrapper,
  SuggestionType,
  SuggestionIcon,
}
