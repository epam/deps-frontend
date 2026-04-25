
import styled from 'styled-components'

export const ExtractorSettingsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
`

export const ExtractorSettingsItemLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale11};
  text-transform: uppercase;
`

export const ExtractorSettingsItemValue = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: space-between;
  width: 100%;
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.grayscale11};
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.8rem;
  padding: 0.4rem 0.8rem;
`

export const ExtractorSettingsItemsWrapper = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
`

export const CustomInstructionItem = styled(ExtractorSettingsItem)`
  height: calc(100% - 26rem);
`

export const CustomInstructionItemValue = styled(ExtractorSettingsItemValue)`
  height: 100%;
  overflow-y: auto;
`
