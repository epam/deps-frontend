
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { WarningTriangleIcon } from '@/components/Icons/WarningTriangleIcon'

const Link = styled(Button.Link)`
  min-width: 0;
  color: ${(props) => props.theme.color.grayscale19};
  font-weight: 700;
  text-align: left;
`

const Icon = styled(WarningTriangleIcon)`
  fill: ${(props) => props.theme.color.primary3};
  flex-shrink: 0;
`

const Text = styled.span`
  flex-shrink: 0;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  margin-bottom: 2rem;
  padding: 1.2rem 2.4rem;
  background: ${(props) => props.theme.color.primary4};
  border-radius: 4.8rem;
  color: ${(props) => props.theme.color.primary3};
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 2.2rem;
`

export {
  Icon,
  Link,
  Text,
  Wrapper,
}
