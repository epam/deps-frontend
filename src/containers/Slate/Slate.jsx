
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Image } from './components/Image'
import { Paragraph } from './components/Paragraph'
import { Table, Row, Cell } from './components/Table'
import { slateNodeShape, SLATE_ELEMENT_TYPE } from './models'

const ELEMENT_TYPE_TO_SLATE_ELEMENT = {
  [SLATE_ELEMENT_TYPE.PARAGRAPH]: Paragraph,
  [SLATE_ELEMENT_TYPE.TABLE]: Table,
  [SLATE_ELEMENT_TYPE.TABLE_ROW]: Row,
  [SLATE_ELEMENT_TYPE.TABLE_CELL]: Cell,
  [SLATE_ELEMENT_TYPE.IMAGE]: Image,
}

const SlateView = ({
  value,
}) => {
  const [editor] = useState(() => withReact(createEditor()))
  const mapTypeToElement = (type) => ELEMENT_TYPE_TO_SLATE_ELEMENT[type]

  const renderElement = useCallback((elementProps) => {
    const Element = mapTypeToElement(elementProps.element.type)
    return <Element {...elementProps} />
  }, [])

  return (
    <Slate
      editor={editor}
      value={value}
    >
      <Editable
        readOnly
        renderElement={renderElement}
      />
    </Slate>
  )
}

SlateView.propTypes = {
  value: PropTypes.arrayOf(slateNodeShape).isRequired,
}

export {
  SlateView as Slate,
}
