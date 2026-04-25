
import AntdAutocomplete from 'antd/es/auto-complete'
import styled, { css } from 'styled-components'

const StyledAutocomplete = styled(AntdAutocomplete)`
  color: ${(props) => props.theme.color.grayscale18};
  
  &&& .ant-select-selector {
    border: none;
    box-shadow: none !important;
    padding: 0;

    > span {
      left: 0.8rem;
      right: 0;
    }

    ${({ theme, disabled }) => disabled && css`
      background-color: ${theme.color.grayscale14};
      color: ${theme.color.grayscale22};
    `}
  }
`

export {
  StyledAutocomplete,
}
