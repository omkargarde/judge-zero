interface ISubmissions {
  source_code: string
  language_id: number
  stdin: string
  expected_output: string
}
interface ISubmissionResults {
  language_id: number
  stdout: string
  status_id: number
  stderr: null
  token: string
}

interface IBatchResults {
  submissions: ISubmissionResults[]
}

export type { IBatchResults, ISubmissionResults, ISubmissions }
