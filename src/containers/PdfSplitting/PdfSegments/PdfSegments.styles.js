
import styled from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 36rem;
  padding: 1.6rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.grayscale15};
  background-color: ${({ theme }) => theme.color.grayscale14};
`

export const SegmentsWrapper = styled.section`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.6rem 0.6rem;
  margin-bottom: 1.6rem;
  border: 1px solid ${({ theme }) => theme.color.grayscale15};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.primary3};
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
  padding-inline: 1rem;
`

export const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1rem 1rem;
  color: ${({ theme }) => theme.color.grayscale18};
`

export const GroupSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

export const StyledGroupLabel = styled(FieldLabel)`
  color: ${({ theme }) => theme.color.grayscale11};
  text-transform: uppercase;
  font-weight: 600;
  font-size: 1.2rem;
`
