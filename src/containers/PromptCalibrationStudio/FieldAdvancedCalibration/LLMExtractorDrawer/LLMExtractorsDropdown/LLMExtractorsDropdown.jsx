
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
  useMemo,
} from 'react'
import { Dropdown } from '@/components/Dropdown'
import { PlusCircleIcon } from '@/components/Icons/PlusCircleIcon'
import { LongText } from '@/components/LongText'
import { MenuTrigger } from '@/components/Menu'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { extractorShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import {
  ArrowIcon,
  DropdownMenu,
  MenuItem,
  StyledSearchInput,
  StyledLongText,
  TextButton,
  TriggerButton,
  ItemsWrapper,
} from './LLMExtractorsDropdown.styles'

const SearchInputItemKey = 'search-input-item'
const CreateLLMExtractorButtonItemKey = 'create-llm-extractor-button-item'

export const LLMExtractorsDropdown = ({
  selectedExtractor,
  onSelectExtractor,
  onCreateExtractor,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const { extractors } = useFieldCalibration()

  const filteredExtractors = useMemo(() => (
    extractors.filter((extractor) => (
      extractor.name.toLowerCase().includes(searchValue.toLowerCase())
    ))
  ), [extractors, searchValue])

  const toggleDropdownVisibility = useCallback(() => {
    setIsDropdownOpen((prevIsDropdownOpen) => !prevIsDropdownOpen)
  }, [])

  const onSelectHandler = useCallback((extractorId) => {
    onSelectExtractor(extractorId)
    toggleDropdownVisibility()
  }, [onSelectExtractor, toggleDropdownVisibility])

  const onClickHandler = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const SearchInputItem = useMemo(() => (
    <MenuItem key={SearchInputItemKey}>
      <StyledSearchInput
        filter={searchValue}
        onChange={setSearchValue}
        onClick={onClickHandler}
      />
    </MenuItem>
  ), [onClickHandler, searchValue])

  const onCreateHandler = useCallback(() => {
    onCreateExtractor()
    toggleDropdownVisibility()
  }, [onCreateExtractor, toggleDropdownVisibility])

  const CreateLLMExtractorButtonItem = useMemo(() => (
    <MenuItem key={CreateLLMExtractorButtonItemKey}>
      <TextButton onClick={onCreateHandler}>
        <PlusCircleIcon />
        {localize(Localization.CREATE_LLM_EXTRACTOR)}
      </TextButton>
    </MenuItem>
  ), [onCreateHandler])

  const MenuItems = useMemo(() => (
    <ItemsWrapper>
      {
        filteredExtractors.map((extractor) => (
          <MenuItem
            key={extractor.id}
            $isSelected={selectedExtractor?.id === extractor.id}
            onClick={() => onSelectHandler(extractor.id)}
          >
            <StyledLongText text={extractor.name} />
          </MenuItem>
        ))
      }
    </ItemsWrapper>
  ), [
    filteredExtractors,
    onSelectHandler,
    selectedExtractor?.id,
  ])

  const renderDropdownMenu = useCallback(() => (
    <DropdownMenu>
      {SearchInputItem}
      {CreateLLMExtractorButtonItem}
      {MenuItems}
    </DropdownMenu>
  ), [
    CreateLLMExtractorButtonItem,
    SearchInputItem,
    MenuItems,
  ])

  return (
    <Dropdown
      dropdownRender={renderDropdownMenu}
      onOpenChange={toggleDropdownVisibility}
      trigger={MenuTrigger.CLICK}
    >
      <TriggerButton>
        <ArrowIcon $isOpen={isDropdownOpen} />
        <LongText
          key={selectedExtractor?.name}
          text={selectedExtractor?.name}
        />
      </TriggerButton>
    </Dropdown>
  )
}

LLMExtractorsDropdown.propTypes = {
  selectedExtractor: extractorShape,
  onSelectExtractor: PropTypes.func.isRequired,
  onCreateExtractor: PropTypes.func.isRequired,
}
