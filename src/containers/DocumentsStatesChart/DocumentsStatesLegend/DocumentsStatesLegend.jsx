
import PropTypes from 'prop-types'
import { List } from '@/components/List'
import {
  ListStyleType,
  ListItem,
  TitleValue,
  TitleWrapper,
} from './DocumentsStatesLegend.styles'

const renderListItemTitle = ({ id, value }) => (
  <TitleWrapper>
    {id}
    <TitleValue>
      {value}
    </TitleValue>
  </TitleWrapper>
)

const DocumentsStatesLegend = ({ config }) => (
  <List>
    {
      config.map((status) => (
        <ListItem key={status.id}>
          <List.Item.Meta
            avatar={<ListStyleType color={status.color} />}
            title={renderListItemTitle(status)}
          />
        </ListItem>
      ))
    }
  </List>
)

DocumentsStatesLegend.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      states: PropTypes.arrayOf(
        PropTypes.string,
      ),
    }).isRequired,
  ),
}
export {
  DocumentsStatesLegend,
}
