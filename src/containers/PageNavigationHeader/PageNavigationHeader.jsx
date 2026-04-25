
import PropTypes from 'prop-types'
import { HeadingLevel } from '@/components/Heading'
import { BackToSourceButton } from '@/containers/BackToSourceButton'
import { Title, Wrapper, Column } from './PageNavigationHeader.styles'

const PageNavigationHeader = ({
  parentPath,
  title,
  renderExtra,
}) => (
  <Wrapper>
    <Column>
      <BackToSourceButton sourcePath={parentPath} />
      <Title
        ellipsis={{ tooltip: title }}
        level={HeadingLevel.H2}
      >
        {title}
      </Title>
    </Column>
    {renderExtra?.()}
  </Wrapper>
)

PageNavigationHeader.propTypes = {
  parentPath: PropTypes.string.isRequired,
  renderExtra: PropTypes.func,
  title: PropTypes.string,
}

export {
  PageNavigationHeader,
}
