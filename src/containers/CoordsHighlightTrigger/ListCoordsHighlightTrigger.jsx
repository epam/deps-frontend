
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { Button } from '@/components/Button'
import { LabelingIcon } from '@/components/Icons/LabelingIcon'
import { Localization, localize } from '@/localization/i18n'
import { documentShape, Document } from '@/models/Document'
import { rectCoordsShape } from '@/models/Rect'
import { sourceCharRangeShape } from '@/models/SourceCoordinates'
import { Badge, Wrapper, Option, Menu } from './CoordsHighlightTrigger.styles'

const ListCoordsHighlightTrigger = ({ coords, highlightArea, document }) => {
  const onClickHighlight = useCallback(() => {
    if (coords.length === 1) {
      const [coord] = coords

      highlightArea(coord.coordinates, coord.page, coord.sourceId)
    }
  }, [coords, highlightArea])

  const optionRenderer = useCallback((field, page) => ({
    content: () => (
      <Option
        key={page}
        onClick={
          () => highlightArea(field.coordinates, field.page, field.sourceId)
        }
      >
        {localize(Localization.OPTION_TITLE, { page })}
      </Option>
    ),
  }), [highlightArea])

  const renderDropdownOptions = useMemo(() => {
    if (coords.length === 1) {
      return []
    }

    return coords.map((coord) => {
      if (coord.sourceId) {
        return optionRenderer(coord, Document.getPageBySourceId(document, coord.sourceId))
      }
      return optionRenderer(coord, coord.page)
    })
  }, [coords, optionRenderer, document])

  return (
    <Wrapper>
      <Badge count={renderDropdownOptions.length}>
        <Menu
          getPopupContainer={(trigger) => trigger.parentNode}
          items={renderDropdownOptions}
        >
          <Button.Icon
            icon={<LabelingIcon />}
            onClick={onClickHighlight}
          />
        </Menu>
      </Badge>
    </Wrapper>
  )
}

ListCoordsHighlightTrigger.propTypes = {
  coords: PropTypes.arrayOf(
    PropTypes.shape({
      page: PropTypes.number,
      sourceId: PropTypes.string,
      coordinates: PropTypes.arrayOf(
        PropTypes.oneOfType([
          rectCoordsShape,
          PropTypes.arrayOf(PropTypes.number),
          sourceCharRangeShape,
        ]).isRequired,
      ).isRequired,
    }),
  ),
  highlightArea: PropTypes.func.isRequired,
  document: documentShape.isRequired,
}

export {
  ListCoordsHighlightTrigger,
}
