
import Typography from 'antd/es/typography'
import 'antd/lib/typography/style/index.less'
import styled, { css } from 'styled-components'
import { HeadingLevel } from './Heading'

const { Title } = Typography

export const StyledHeading = styled(Title)`
  &.ant-typography {
    ${(props) => {
      switch (props.level) {
        case HeadingLevel.H2:
          return css`
            font-size: 2.2rem;
            line-height: 2.8rem;
          `

        case HeadingLevel.H3:
          return css`
            font-size: 1.6rem;
            line-height: 2.2rem;
          `
        default:
      }
    }}
  }
`
