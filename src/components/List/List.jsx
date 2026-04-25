
import AntdList from 'antd/es/list'
import 'antd/lib/list/style/index.less'
import { StyledItem } from './List.styles'

const Meta = (props) => <AntdList.Item.Meta {...props} />
StyledItem.Meta = Meta

const List = (props) => <AntdList {...props} />
List.Item = StyledItem

export {
  List,
}
