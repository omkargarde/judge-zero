const PROBLEM_MESSAGES = {
  LanguageNotSupported: (language: string) => `${language} is not supported`,
} as const

export { PROBLEM_MESSAGES }
