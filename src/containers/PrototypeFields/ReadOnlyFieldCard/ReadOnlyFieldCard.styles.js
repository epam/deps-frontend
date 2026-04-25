
import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.color.grayscale14};
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 8px;
  padding: 1.6rem;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 1.2rem;
`

const FieldName = styled.div`
  margin-right: auto;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.grayscale18};
`

const KeysWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Separator = styled.span`
  display: inline-block;
  width: 1px;
  margin-inline: 1.6rem;
  align-self: stretch;
  background-color: ${(props) => props.theme.color.grayscale15};
`

const TypeWrapper = styled.span`
  display: flex;
  align-self: stretch;
  align-items: center;
  padding: 0.3rem 1.2rem;
  font-weight: 600;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 16px;
`

export {
  Wrapper,
  Header,
  FieldName,
  KeysWrapper,
  Separator,
  TypeWrapper,
}
