
import styled from 'styled-components'
import { LongText } from '@/components/LongText'
import { RefreshTable } from '@/containers/RefreshTable'

const AdditionalInformation = styled.div`
  display: flex;
  color: ${(props) => props.theme.color.grayscale11};
  font-weight: 400;
  font-size: 1.4rem;
  margin: 0 auto 0 1.6rem;
`

const InfoCellText = styled(LongText)`
  border-left: 1px solid ${(props) => props.theme.color.grayscale17};
  padding: 0.2rem 1.6rem;
`

const RefreshTableButton = styled(RefreshTable)`
  margin-right: 1.2rem;
`

export {
  AdditionalInformation,
  InfoCellText,
  RefreshTableButton,
}
