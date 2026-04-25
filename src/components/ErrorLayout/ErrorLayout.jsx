
import PropTypes from 'prop-types'
import { Content } from '@/components/Layout'
import { ERROR_LAYOUT_INFO_TEXT } from '@/constants/automation'
import { childrenShape } from '@/utils/propTypes'
import {
  Status,
  InfoText,
  Heading,
  Wrapper,
} from './ErrorLayout.styles'

const ErrorLayout = ({
  statusCode,
  heading,
  info,
  children,
}) => (
  <Content>
    <Wrapper>
      <Status>{statusCode}</Status>
      {
        heading && <Heading>{heading}</Heading>
      }
      <InfoText
        data-automation={ERROR_LAYOUT_INFO_TEXT}
      >
        {
          info
        }
      </InfoText>
      {
        children
      }
    </Wrapper>
  </Content>
)

ErrorLayout.propTypes = {
  statusCode: PropTypes.number,
  heading: PropTypes.string,
  info: PropTypes.string,
  children: childrenShape,
}

export {
  ErrorLayout,
}
