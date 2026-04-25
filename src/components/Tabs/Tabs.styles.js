
import AntdTabs from 'antd/es/tabs'
import 'antd/lib/tabs/style/index.less'
import styled from 'styled-components'

const Tabs = styled(AntdTabs)`
  font-size: 1.4rem;

  .ant-tabs-tab {
    margin: 1rem 1.8rem !important;
    color: ${(props) => props.theme.color.grayscale13};
    font-weight: 600;

    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${(props) => props.theme.color.primary2};
      text-shadow: none;
    }
  }

  .ant-tabs-nav::before {
    display: none;
  }
  
  .ant-tabs-nav-operations {
    display: none !important;
  }

  .ant-tabs-ink-bar {
    background: ${(props) => props.theme.color.primary2};
  }
    
  .ant-tabs-content-holder {
    min-width: 40rem;
    overflow-y: auto;
    overflow-x: hidden;
  }
    
  .ant-tabs-content, .ant-tabs-tabpane {
    height: 100%;
  }
`

export {
  Tabs,
}
