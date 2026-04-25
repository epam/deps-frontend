import { localize, Localization } from '@/localization/i18n'

export const KnownLLM = {
  OPENAI_GPT_4_OMNI_MINI_TEXT: 'openai.gpt-4-omni-mini-text',
  OPENAI_GPT_4_OMNI_TEXT: 'openai.gpt-4-omni-text',
  ANTHROPIC_CLAUDE_V3_SONNET: 'anthropic.claude-v3-sonnet',
  MISTRAL_MIXTRAL: 'mistral.mixtral',
  META_LLAMA3_70B: 'meta.llama3-70B',
  GOOGLE_GEMINI_PRO: 'google.gemini-pro',
  OPENAI_GPT_4: 'openai.gpt-4',
  OPENAI_GPT_4_32K: 'openai.gpt-4-32k',
  OPENAI_GPT_4_TURBO: 'openai.gpt-4-turbo',
  OPENAI_GPT_3_5_TURBO: 'openai.gpt-3.5-turbo',
  EPAM_DIAL_RAG: 'epam.dial-rag',
  OPENAI_GPT_4_OMNI: 'openai.gpt-4-omni',
}

export const RESOURCE_KNOWN_LLM_DESCRIPTION = {
  [KnownLLM.OPENAI_GPT_4_OMNI_MINI_TEXT]: localize(Localization.OPENAI_GPT_4_OMNI_MINI_TEXT),
  [KnownLLM.OPENAI_GPT_4_OMNI_TEXT]: localize(Localization.OPENAI_GPT_4_OMNI_TEXT),
  [KnownLLM.ANTHROPIC_CLAUDE_V3_SONNET]: localize(Localization.ANTHROPIC_CLAUDE_V3_SONNET),
  [KnownLLM.MISTRAL_MIXTRAL]: localize(Localization.MISTRAL_MIXTRAL),
  [KnownLLM.META_LLAMA3_70B]: localize(Localization.META_LLAMA3_70B),
  [KnownLLM.GOOGLE_GEMINI_PRO]: localize(Localization.GOOGLE_GEMINI_PRO),
  [KnownLLM.OPENAI_GPT_4]: localize(Localization.OPENAI_GPT_4),
  [KnownLLM.OPENAI_GPT_4_32K]: localize(Localization.OPENAI_GPT_4_32K),
  [KnownLLM.OPENAI_GPT_4_TURBO]: localize(Localization.OPENAI_GPT_4_TURBO),
  [KnownLLM.OPENAI_GPT_3_5_TURBO]: localize(Localization.OPENAI_GPT_3_5_TURBO),
  [KnownLLM.EPAM_DIAL_RAG]: localize(Localization.EPAM_DIAL_RAG),
  [KnownLLM.OPENAI_GPT_4_OMNI]: localize(Localization.OPENAI_GPT_4_OMNI),
}

export const KnownLlmProvider = {
  AWS_BEDROCK: 'aws-bedrock',
  AZURE: 'azure',
  DIAL: 'dial',
  GOOGLE: 'google',
  OPENAI: 'openai',
}
