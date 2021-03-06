import FuzzySearch from 'fuzzy-search'
import { Choice, PromptObject } from 'prompts'

import { GitCConfig } from '../interfaces'

const choice = (
  { details, disableEmoji }: GitCConfig,
  type: string
): Choice => {
  const { description, emoji } = details[type]
  const prefix = emoji && !disableEmoji ? `${emoji} ` : ''

  return {
    title: `${prefix}${type}`,
    description,
    value: type
  }
}

export const type = (config: GitCConfig): PromptObject => {
  const choices = config.types.map((t: string) => choice(config, t))
  const searcher = new FuzzySearch(choices, ['title'], { caseSensitive: false })

  return {
    choices,
    message: "Select the type of change that you're committing:",
    name: 'type',
    suggest: (input: string) => Promise.resolve(searcher.search(input)),
    type: 'autocomplete'
  }
}
