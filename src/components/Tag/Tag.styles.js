
import 'antd/lib/tag/style/index.less'
import AntTag from 'antd/es/tag'
import styled from 'styled-components'

const StyledTag = styled(AntTag)`
  width: fit-content;
  max-width: 100%;
  display: flex;
  align-items: center;
  padding: 0.4rem 1.2rem;
  font-size: 1.4rem;
  line-height: 2rem;
  background-color: ${(props) => props.theme.color.grayscale20};
  border-color: ${(props) => props.theme.color.grayscale15};

  .ant-tag-close-icon {
    position: relative;
    top: 0.2rem;
    font-size: 1.2rem;
    margin-left: 0.5rem;
  }
`

export {
  StyledTag,
}
