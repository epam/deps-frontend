
import PropTypes from 'prop-types'
import { CustomSelect } from '@/components/Select'
import { localize, Localization } from '@/localization/i18n'
import { LLMProvider, llmProviderShape } from '@/models/LLMProvider'
import { Wrapper, Title } from './LLMProviderSelect.styles'

const LLMProviderSelect = ({
  onChange,
  providers,
  providerCode,
}) => (
  <Wrapper>
    <Title>
      {localize(Localization.PROVIDER)}
    </Title>
    <CustomSelect
      onChange={onChange}
      options={providers.map(LLMProvider.toOption)}
      placeholder={localize(Localization.SELECT_PROVIDER)}
      value={providerCode}
    />
  </Wrapper>
)

LLMProviderSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(
    llmProviderShape,
  ).isRequired,
  providerCode: PropTypes.string,
}

export {
  LLMProviderSelect,
}
