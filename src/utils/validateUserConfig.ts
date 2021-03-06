import { defaultConfig } from '../defaults'
import { GitCConfig } from '../interfaces'

const allowedKeys = Object.keys(defaultConfig)
const ERROR_TYPE = '[config]'

// eslint-disable-next-line @typescript-eslint/ban-types
const hasProperty = (property: string, userConfig?: object | null) => {
  return userConfig && property in userConfig
}

// eslint-disable-next-line @typescript-eslint/ban-types
const hasAdditionalProperties = (userConfig: object) => {
  return Object.keys(userConfig).some(key => !allowedKeys.includes(key))
}

const isValidType = (
  property: keyof GitCConfig,
  type: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  userConfig?: object | null
) => {
  if (!hasProperty(property, userConfig)) return true

  return typeof (userConfig as GitCConfig)[property] === type
}

const isArrayOfString = (
  property: keyof GitCConfig,
  // eslint-disable-next-line @typescript-eslint/ban-types
  userConfig?: object | null
) => {
  if (!hasProperty(property, userConfig)) return true
  const isArray = Array.isArray((userConfig as GitCConfig)[property])
  const array = (userConfig as GitCConfig)[property] as []

  return isArray && array.every(key => typeof key === 'string')
}

const isValidDetails = (
  property: keyof GitCConfig,
  // eslint-disable-next-line @typescript-eslint/ban-types
  userConfig?: object | null
) => {
  if (!hasProperty(property, userConfig)) return true

  return Object.values((userConfig as GitCConfig)[property]).every(object => {
    return (
      Object.keys(object).every(
        key => key === 'description' || key === 'emoji'
      ) && Object.values(object).every(key => typeof key === 'string')
    )
  })
}

const errorObject = (message: string) => {
  return Promise.resolve({
    isValid: false,
    error: `${ERROR_TYPE} ${message}!`
  })
}

// eslint-disable-next-line complexity
const validateConfig = (
  userConfig: unknown
): Promise<{ isValid: boolean; error?: string }> => {
  if (typeof userConfig === 'object') {
    if (userConfig && hasAdditionalProperties(userConfig)) {
      return errorObject('additional properties detected')
    }

    if (!isValidType('disableEmoji', 'boolean', userConfig)) {
      return errorObject('disableEmoji must a boolean')
    }

    if (!isValidType('useCommitlintConfig', 'boolean', userConfig)) {
      return errorObject('useCommitlintConfig must a boolean')
    }

    if (!isValidType('maxMessageLength', 'number', userConfig)) {
      return errorObject('maxMessageLength must a number')
    }

    if (!isValidType('minMessageLength', 'number', userConfig)) {
      return errorObject('minMessageLength must a number')
    }

    if (!isValidType('closedIssueEmoji', 'string', userConfig)) {
      return errorObject('closedIssueEmoji must a string')
    }

    if (!isValidType('breakingChangeEmoji', 'string', userConfig)) {
      return errorObject('breakingChangeEmoji must a number')
    }

    if (!isArrayOfString('questions', userConfig)) {
      return errorObject('questions must an array of strings')
    }

    if (!isArrayOfString('types', userConfig)) {
      return errorObject('types must an array of strings')
    }

    if (!isArrayOfString('scopes', userConfig)) {
      return errorObject('scopes must an array of strings')
    }

    if (!isValidType('details', 'object', userConfig)) {
      return errorObject('details must be an object')
    }

    if (!isValidDetails('details', userConfig)) {
      return errorObject(
        'details must look like "{ description: "A new feature", emoji: "🎸" }"'
      )
    }

    return Promise.resolve({ isValid: true })
  }
  return errorObject('invalid format')
}

export const validateUserConfig = async (
  userConfig: unknown
): Promise<boolean> => {
  const { isValid, error } = await validateConfig(userConfig)

  if (error) {
    throw new Error(error)
  }

  return isValid
}
