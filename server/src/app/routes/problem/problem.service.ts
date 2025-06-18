import type { IBatchResults, ISubmissions } from './problem.type.ts'
import axios from 'axios'
import { Env } from '../../../env.ts'
import { Logger } from '../../../logger.ts'
import { Nap } from '../../utils/nap.util.ts'
import { JUDGE0_STATUS } from './problem.constant.ts'

function GetJudge0LanguageId(language: string) {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  }
  return languageMap[language]
}

async function submitBatch(submissions: ISubmissions[]) {
  const { data }: { data: { token: string }[] } = await axios.post(`${Env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
    submissions,
  })
  Logger.info('Submission results, ', data)
  return data
}

async function pollBatchResults(tokens: string[]) {
  while (true) {
    const { data }: { data: IBatchResults } = await axios.get(`${Env.JUDGE0_API_URL}/submissions/batch`, {
      params: {
        tokens: tokens.join(','),
        base64_encoded: false,
      },
    })
    Logger.info('poll data::', data)
    const results = data.submissions
    const isAllDone = results
      .every(
        result =>
          result.status.id !== JUDGE0_STATUS.InQueue && result.status.id !== JUDGE0_STATUS.Processing,
      )
    if (isAllDone) {
      return results
    }
    await Nap(1000)
  }
}

export { GetJudge0LanguageId, pollBatchResults, submitBatch }
