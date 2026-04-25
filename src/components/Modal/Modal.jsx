
import AntdModal from 'antd/es/modal'
import { MODAL } from '@/constants/automation'
import 'antd/lib/modal/style/index.less'

const Modal = (props) => (
  <AntdModal
    data-automation={MODAL}
    {...props}
  />
)

Modal.confirm = AntdModal.confirm

export {
  Modal,
}
