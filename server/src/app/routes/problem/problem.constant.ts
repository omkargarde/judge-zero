const PROBLEM_MESSAGES = {
  LanguageNotSupported: (language: string) => `${language} is not supported`,
  ProblemCreatedSuccessfully: 'problem was created successfully',
} as const

export { PROBLEM_MESSAGES }
