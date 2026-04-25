
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { Placement } from '@/enums/Placement'
import { childrenShape } from '@/utils/propTypes'
import { StyledDrawer } from './Drawer.styles'

const dataTestId = 'drawer'

class Drawer extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    placement: PropTypes.oneOf([Placement.RIGHT, Placement.LEFT]),
    hasCloseIcon: PropTypes.bool,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: childrenShape.isRequired,
    className: PropTypes.string,
    footer: childrenShape,
    getContainer: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.instanceOf(HTMLElement),
    ]),
    destroyOnClose: PropTypes.bool,
    push: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        distance: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
      }),
    ]),
    mask: PropTypes.bool,
    closeIcon: childrenShape,
    maskClosable: PropTypes.bool,
  }

  render = () => (
    <StyledDrawer
      className={this.props.className}
      closable={this.props.hasCloseIcon}
      closeIcon={this.props.closeIcon}
      data-testid={dataTestId}
      destroyOnClose={this.props.destroyOnClose}
      footer={this.props.footer}
      getContainer={this.props.getContainer}
      mask={this.props.mask}
      maskClosable={this.props.maskClosable}
      onClose={this.props.onClose}
      open={this.props.open}
      placement={this.props.placement}
      push={this.props.push}
      title={this.props.title}
      width={this.props.width}
    >
      {this.props.children}
    </StyledDrawer>
  )
}

Drawer.defaultProps = {
  getContainer: false,
}

export {
  Drawer,
}
