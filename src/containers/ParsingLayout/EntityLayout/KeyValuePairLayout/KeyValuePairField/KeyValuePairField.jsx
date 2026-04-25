
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { LabelingIcon } from '@/components/Icons/LabelingIcon'
import { useHighlightCoords, useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { keyValuePairElementLayoutShape } from '@/models/DocumentLayout'
import {
  ContentWrapper,
  Input,
  KeyWrapper,
  ValueWrapper,
} from './KeyValuePairField.styles'

const TEST_ID = {
  KEY_INPUT: 'key-input',
  VALUE_INPUT: 'value-input',
  KEY_ICON_BTN: 'key-icon-btn',
  VALUE_ICON_BTN: 'value-icon-btn',
}

const KeyValuePairField = ({
  keyData,
  page,
  keyValuePairId,
  parsingType,
  pageId,
  valueData,
}) => {
  const [keyContent, setKeyContent] = useState(keyData.content)
  const [valueContent, setValueContent] = useState(valueData?.content || '')

  const { isEditable, updateKeyValuePair } = useLayoutMutation(parsingType)

  const { highlightCoords } = useHighlightCoords()

  useEffect(() => {
    setKeyContent(keyData.content)
  }, [keyData.content])

  useEffect(() => {
    setValueContent(valueData?.content || '')
  }, [valueData?.content])

  const onClickHandler = (coords) => {
    highlightCoords({
      field: [coords],
      page,
    })
  }

  const onKeyBlur = async () => {
    if (keyContent === keyData.content) {
      return
    }

    await updateKeyValuePair({
      pageId,
      keyValuePairId,
      body: {
        key: {
          content: keyContent,
        },
        value: valueData
          ? {
            content: valueContent,
          }
          : undefined,
      },
    })
  }

  const onValueBlur = async () => {
    if (!valueData || valueContent === valueData.content) {
      return
    }

    await updateKeyValuePair({
      pageId,
      keyValuePairId,
      body: {
        key: {
          content: keyContent,
        },
        value: {
          content: valueContent,
        },
      },
    })
  }

  const onKeyChange = (e) => setKeyContent(e.target.value)

  const onValueChange = (e) => setValueContent(e.target.value)

  return (
    <ContentWrapper>
      <KeyWrapper>
        <Input
          data-testid={TEST_ID.KEY_INPUT}
          disabled={!isEditable}
          onBlur={onKeyBlur}
          onChange={onKeyChange}
          value={keyContent}
        />
        <Badge>
          <Button.Icon
            data-testid={TEST_ID.KEY_ICON_BTN}
            icon={<LabelingIcon />}
            onClick={() => onClickHandler(keyData.polygon)}
          />
        </Badge>
      </KeyWrapper>
      {
        valueData && (
          <ValueWrapper>
            <Input
              data-testid={TEST_ID.VALUE_INPUT}
              disabled={!isEditable}
              onBlur={onValueBlur}
              onChange={onValueChange}
              value={valueContent}
            />
            <Badge>
              <Button.Icon
                data-testid={TEST_ID.VALUE_ICON_BTN}
                icon={<LabelingIcon />}
                onClick={() => onClickHandler(valueData.polygon)}
              />
            </Badge>
          </ValueWrapper>
        )
      }
    </ContentWrapper>
  )
}

KeyValuePairField.propTypes = {
  page: PropTypes.number.isRequired,
  parsingType: PropTypes.oneOf(
    Object.values(DOCUMENT_LAYOUT_PARSING_TYPE),
  ).isRequired,
  keyData: keyValuePairElementLayoutShape.isRequired,
  valueData: keyValuePairElementLayoutShape,
  keyValuePairId: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired,
}

export { KeyValuePairField }
