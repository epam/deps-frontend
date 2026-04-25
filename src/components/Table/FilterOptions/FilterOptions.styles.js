
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const CheckboxBlock = styled.ul`
  display: flex;
  flex-direction: column;
  max-height: 40rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: none;
  position: relative;
  list-style-type: none;
  padding: 0.4rem 0;
  margin: 0;
  text-align: left;
  background: ${(props) => props.theme.color.grayscale14};
  width: 100%;
  border-top: 1px solid ${(props) => `${props.theme.color.secondaryLight}`};
`

export const CheckboxItem = styled.li`
  padding: 0.5rem 1.2rem;
  margin: 0;
  clear: both;
  font-size: 1.4rem;
  font-weight: normal;
  color: ${(props) => props.theme.color.grayscale5};
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;
  line-height: 2.2rem;
  
  .ant-checkbox-wrapper {
    width: 100%;
  }
  
  .ant-checkbox ~ span {
    width: 100%;
  }
`

export const FooterButtons = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  overflow: hidden;
  padding: 0.7rem 0.8rem;
  width: 100%;
  border-top: 1px solid ${(props) => props.theme.color.secondaryLight};
`
