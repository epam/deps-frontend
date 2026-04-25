
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { SelectOption } from '@/components/Select'
import { localize, Localization } from '@/localization/i18n'
import { PageSelector } from '../PageSelector'
import {
  ErrorMessage,
  SelectTitle,
  SelectorsWrapper,
  Wrapper,
} from './PageRangeSelectors.styles'

const PageRangeSelectors = ({
  documentPages,
  isPageRangeValid,
  onChangeEndPage,
  onChangeStartPage,
  pageRange,
}) => {
  const [startPage, endPage] = pageRange

  const startPageOptions = useMemo(() =>
    documentPages.map((page) =>
      new SelectOption(
        page,
        page,
        null,
        Number(page) > Number(endPage),
      ),
    ),
  [documentPages, endPage],
  )

  const endPageOptions = useMemo(() =>
    documentPages.map((page) =>
      new SelectOption(
        page,
        page,
        null,
        Number(page) < Number(startPage),
      ),
    ),
  [documentPages, startPage],
  )

  return (
    <Wrapper>
      <SelectorsWrapper>
        <div>
          <SelectTitle>{localize(Localization.START_PAGE)}</SelectTitle>
          <PageSelector
            isValid={isPageRangeValid}
            onChange={onChangeStartPage}
            options={startPageOptions}
            value={startPage}
          />
        </div>
        <div>
          <SelectTitle>{localize(Localization.END_PAGE)}</SelectTitle>
          <PageSelector
            isValid={isPageRangeValid}
            onChange={onChangeEndPage}
            options={endPageOptions}
            value={endPage}
          />
        </div>
      </SelectorsWrapper>
      {
        !isPageRangeValid && (
          <ErrorMessage>
            {localize(Localization.PAGE_RANGE_ERROR_MESSAGE)}
          </ErrorMessage>
        )
      }
    </Wrapper>
  )
}

PageRangeSelectors.propTypes = {
  documentPages: PropTypes.arrayOf(PropTypes.string).isRequired,
  isPageRangeValid: PropTypes.bool.isRequired,
  onChangeEndPage: PropTypes.func.isRequired,
  onChangeStartPage: PropTypes.func.isRequired,
  pageRange: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export {
  PageRangeSelectors,
}
