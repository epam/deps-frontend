
import AntdPopover from 'antd/es/popover'
import 'antd/lib/popover/style/index.less'

const PopoverTrigger = {
  CLICK: 'click',
  FOCUS: 'focus',
  HOVER: 'hover',
}

const Popover = (props) => <AntdPopover {...props} />

export {
  PopoverTrigger,
  Popover,
}
