const PROBLEM_MESSAGES = {
  LanguageNotSupported: (language: string) => `${language} is not supported`,
  ProblemCreatedSuccessfully: 'problem was created successfully',
} as const

const JUDGE0_STATUS = {
  InQueue: 1,
  Processing: 2,
  Accepted: 3,
}

export { JUDGE0_STATUS, PROBLEM_MESSAGES }
