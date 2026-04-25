
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Flag } from '@/components/Flag'
import { FlagProps } from '@/components/Flag/FlagProps'
import { FlagType } from '@/components/Flag/FlagType'
import { CustomSelect } from '@/components/Select'
import { FieldType } from '@/enums/FieldType'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { DocumentType } from '@/models/DocumentType'
import { extendedDocumentTypeShape } from '@/models/ExtendedDocumentType'
import {
  ExtractedData,
  ExtractedDataField,
} from '@/models/ExtractedData'
import {
  documentSelector,
  documentTypeSelector,
} from '@/selectors/documentReviewPage'
import { CenteredPageSwitcher, OptionContent } from './DocumentImagePageSwitcher.styles'

const { Option } = CustomSelect

const DocumentImagePageSwitcher = ({
  className,
  disabled,
  pagesQuantity,
  onChangeActivePage,
  activePage,
  documentType,
  document,
}) => {
  const createPageOptions = () => {
    const selectItems = []
    let page = 1

    if (!documentType) {
      return selectItems
    }

    const tablePks = (
      documentType.fields
        ? DocumentType.getFieldsByFieldType(documentType, FieldType.TABLE).map((f) => f.pk)
        : []
    )
    const tableDataPages = (document?.extractedData && new Set(
      ExtractedData.getFieldsByPks(document?.extractedData, tablePks)
        .map((field) => ExtractedDataField.getPagesFromFieldData(field.data, document)).flat(),
    )) || new Set()

    const listOfTablesPks = (
      documentType.fields
        ? DocumentType.getListFieldsByBaseType(documentType, FieldType.TABLE).map((f) => f.pk)
        : []
    )
    const listOfTablesPages = (document?.extractedData && ExtractedData.getFieldsByPks(document?.extractedData, listOfTablesPks)
      .reduce((acc, f) => {
        const pages = f.data.map((data) => ExtractedDataField.getPagesFromFieldData(data, document)).flat()
        pages.forEach((page) => acc.add(page))
        return acc
      }, new Set())) || new Set()

    const tablePages = new Set([...tableDataPages, ...listOfTablesPages])

    while (page <= pagesQuantity) {
      selectItems.push(
        <Option
          key={page}
          value={page}
        >
          <OptionContent>
            {page}
            {
              tablePages.has(page) &&
            (
              <Flag {...new FlagProps(localize(Localization.TABLE_DATA_FLAG),
                FlagType.TABLE_DATA,
                localize(Localization.TABLE_DATA_TOOLTIP),
                Placement.TOP)}
              />
            )
            }
            {
              [].indexOf(page) >= 0 &&
            (
              <Flag {...new FlagProps(localize(Localization.ERROR_FLAG),
                FlagType.ERROR,
                localize(Localization.ERROR_TOOLTIP),
                Placement.TOP)}
              />
            )
            }
            {
              [].indexOf(page) >= 0 &&
            (
              <Flag {...new FlagProps(localize(Localization.WARNING_FLAG),
                FlagType.WARNING,
                localize(Localization.WARNING_TOOLTIP),
                Placement.TOP)}
              />
            )
            }
          </OptionContent>
        </Option>,
      )
      page++
    }

    return selectItems
  }

  return (
    <CenteredPageSwitcher
      activePage={activePage}
      changeActivePage={onChangeActivePage}
      className={className}
      disabled={disabled}
      pageOptions={createPageOptions()}
      pagesQuantity={pagesQuantity}
    />
  )
}

DocumentImagePageSwitcher.propTypes = {
  className: PropTypes.string,
  documentType: extendedDocumentTypeShape,
  activePage: PropTypes.number.isRequired,
  onChangeActivePage: PropTypes.func.isRequired,
  pagesQuantity: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  document: documentShape.isRequired,
}

const mapStateToProps = (state) => ({
  documentType: documentTypeSelector(state),
  document: documentSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(DocumentImagePageSwitcher)

export {
  ConnectedComponent as DocumentImagePageSwitcher,
}
