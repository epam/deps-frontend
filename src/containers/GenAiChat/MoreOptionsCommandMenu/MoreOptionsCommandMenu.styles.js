
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'

const MENU_OPTION_STYLES = css`
  width: 20rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
  font-size: 1.4rem;
`

const IconButton = styled(Button.Icon)`
  width: 3.2rem;
  height: 3.2rem;
  margin-left: 1rem;
  font-size: 1.8rem;
  color: ${(props) => props.theme.color.primary2};
  border: 1px solid ${(props) => props.theme.color.primary2};

  &:disabled {
    border: 1px solid ${(props) => props.theme.color.grayscale4};
  }
`

const DownloadButton = styled(Button.Text)`
  padding: 0;

  && > a {
    ${MENU_OPTION_STYLES}
    padding: 0.5rem 1rem;
  }

  & svg {
    font-size: 1.8rem;
    color: ${(props) => props.theme.color.grayscale11};
  }
`

const ClearHistoryButton = styled(Button.Text)`
  ${MENU_OPTION_STYLES}

  & svg {
    margin-right: 0.2rem;
    font-size: 1.4rem;
    color: ${(props) => props.theme.color.grayscale11};
  }
`

export {
  IconButton,
  DownloadButton,
  ClearHistoryButton,
}
