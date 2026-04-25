
import PropTypes from 'prop-types'
import { useMemo, useState, useEffect } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { LongText } from '@/components/LongText'
import { optionShape } from '@/components/Select'
import {
  CHECKBOX,
  CHECKBOX_ITEM,
  DROPDOWN_OK_LINK,
  DROPDOWN_RESET_LINK,
} from '@/constants/automation'
import { Localization, localize } from '@/localization/i18n'
import {
  CheckboxBlock,
  CheckboxItem,
  FooterButtons,
  Wrapper,
} from './FilterOptions.styles'

const FilterOptions = ({
  onScroll,
  options,
  confirmFilter,
  filter,
  savedKeys,
}) => {
  const [selectedKeys, setSelectedKeys] = useState([])

  useEffect(() => {
    setSelectedKeys(savedKeys)
  }, [savedKeys])

  const areButtonsVisible = !!selectedKeys.length || !!savedKeys.length

  const sortedOptions = useMemo(() => {
    const selectedOptions = selectedKeys
      .map((key) => options.find((option) => option.value === key))
      .filter(Boolean)

    const nonSelectedOptions = options.filter(({ value }) => !selectedKeys.includes(value))

    return [...selectedOptions, ...nonSelectedOptions]
  }, [options, selectedKeys])

  const checkboxHandler = (e) => {
    const updatedOptions = e.target.checked
      ? [...selectedKeys, e.target.id]
      : selectedKeys.filter((option) => option !== e.target.id)

    setSelectedKeys(updatedOptions)
  }

  const onOkClick = () => {
    confirmFilter(selectedKeys)
  }

  const onResetClick = () => {
    setSelectedKeys([])
    confirmFilter([])
  }

  const renderButtons = () => (
    <FooterButtons>
      <Button
        data-automation={DROPDOWN_OK_LINK}
        onClick={onOkClick}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.OK)}
      </Button>
      <Button
        data-automation={DROPDOWN_RESET_LINK}
        onClick={onResetClick}
        type={ButtonType.LINK}
      >
        {localize(Localization.RESET_ALL)}
      </Button>
    </FooterButtons>
  )

  return (
    <Wrapper>
      <CheckboxBlock onScroll={onScroll}>
        {
          sortedOptions.map(({ value, text }) => (
            text.toLowerCase().includes(filter.toLowerCase()) && (
              <CheckboxItem
                key={value}
                data-automation={CHECKBOX_ITEM}
                onChange={checkboxHandler}
              >
                <Checkbox
                  checked={selectedKeys.includes(value)}
                  data-automation={CHECKBOX}
                  id={value}
                >
                  <LongText text={text} />
                </Checkbox>
              </CheckboxItem>
            )
          ))
        }
      </CheckboxBlock>
      {!!areButtonsVisible && renderButtons()}
    </Wrapper>
  )
}

FilterOptions.propTypes = {
  options: PropTypes.arrayOf(optionShape).isRequired,
  confirmFilter: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  savedKeys: PropTypes.arrayOf(PropTypes.string),
  onScroll: PropTypes.func,
}

export {
  FilterOptions,
}
