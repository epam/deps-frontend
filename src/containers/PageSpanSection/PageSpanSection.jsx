
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { RadioOption } from '@/components/Radio/RadioOption'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractorPageSpan, llmExtractionPageSpanShape } from '@/models/LLMExtractor'
import {
  PageRange,
  Wrapper,
  PageModeToggle,
  PageInput,
  Separator,
  PageLabel,
} from './PageSpanSection.styles'

const PagesMode = {
  All_PAGES: 'allPages',
  PAGE_RANGE: 'pageRange',
}

const validatePageRange = ({ start, end }) => {
  if (start === '' || end === '') {
    return false
  }

  const startPage = Number(start)
  const endPage = Number(end)
  return startPage <= endPage
}

const pagesModeOptions = [
  new RadioOption({
    value: PagesMode.All_PAGES,
    text: localize(Localization.ALL_PAGES),
  }),
  new RadioOption({
    value: PagesMode.PAGE_RANGE,
    text: localize(Localization.RANGE),
  }),
]

const MIN_PAGE = 1
const DEFAULT_MAX_PAGE = 50

const DEFAULT_PAGE_SPAN = new LLMExtractorPageSpan({
  start: MIN_PAGE,
  end: DEFAULT_MAX_PAGE,
})

const PageSpanSection = ({
  value: initialPageSpan,
  onChange,
  className,
}) => {
  const [pagesMode, setPagesMode] = useState(initialPageSpan ? PagesMode.PAGE_RANGE : PagesMode.All_PAGES)
  const [pageSpan, setPageSpan] = useState(initialPageSpan || DEFAULT_PAGE_SPAN)
  const { start, end } = pageSpan

  const updatePageSpan = useCallback((pageSpan) => {
    setPageSpan(pageSpan)
    onChange(pageSpan)
  }, [onChange])

  const handleStartPageChange = useCallback((start) => {
    const updatedPageSpan = new LLMExtractorPageSpan({
      start,
      end,
    })
    if (validatePageRange(updatedPageSpan)) {
      updatePageSpan(updatedPageSpan)
    }
  }, [end, updatePageSpan])

  const handleEndPageChange = useCallback((end) => {
    const updatedPageSpan = new LLMExtractorPageSpan({
      start,
      end,
    })
    if (validatePageRange(updatedPageSpan)) {
      updatePageSpan(updatedPageSpan)
    }
  }, [start, updatePageSpan])

  const handlePageModeChange = useCallback((newMode) => {
    setPagesMode(newMode)

    if (newMode === PagesMode.All_PAGES) {
      onChange(null)
    } else if (newMode === PagesMode.PAGE_RANGE) {
      updatePageSpan(DEFAULT_PAGE_SPAN)
    }
  }, [
    updatePageSpan,
    onChange,
  ])

  return (
    <Wrapper className={className}>
      <PageModeToggle
        onChange={handlePageModeChange}
        options={pagesModeOptions}
        value={pagesMode}
      />
      {
        pagesMode === PagesMode.PAGE_RANGE && (
          <PageRange>
            <PageInput
              min={MIN_PAGE}
              onChange={handleStartPageChange}
              value={start}
            />
            <Separator />
            <PageInput
              min={MIN_PAGE}
              onChange={handleEndPageChange}
              value={end}
            />
            <PageLabel>
              {localize(Localization.PAGES)}
            </PageLabel>
          </PageRange>
        )
      }
    </Wrapper>
  )
}

PageSpanSection.propTypes = {
  value: llmExtractionPageSpanShape,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export {
  PageSpanSection,
}
