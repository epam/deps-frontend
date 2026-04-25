
import PropTypes from 'prop-types'
import { childrenShape } from '@/utils/propTypes'
import { StyledCollapse } from './Collapse.styles'

const { Panel } = StyledCollapse

const Collapse = ({
  children,
  className,
  defaultActiveKey,
  extra,
  header,
  collapseId,
  onChange,
  ...props
}) => (
  <StyledCollapse
    className={className}
    defaultActiveKey={defaultActiveKey}
    onChange={onChange}
    {...props}
  >
    <Panel
      key={collapseId}
      extra={extra}
      header={header}
    >
      {children}
    </Panel>
  </StyledCollapse>
)

Collapse.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  defaultActiveKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
  ]),
  extra: PropTypes.node,
  header: childrenShape,
  collapseId: PropTypes.string.isRequired,
  onChange: PropTypes.func,
}

export {
  Collapse,
}
