import type { NextFunction, Request, Response } from 'express'
import type { Difficulty } from '../../../../generated/prisma/index.js'
import type { ISubmissions } from './problem.type.ts'
import { UserRole } from '../../../../generated/prisma/index.js'
import { db } from '../../../libs/db.ts'
import { Logger } from '../../../logger.ts'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from '../../constants/status.constant.ts'

import { ApiResponse } from '../../utils/api-response.util.ts'
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '../../utils/error.util.ts'
import { AUTH_MESSAGES } from '../auth/auth.constant.ts'
import { PROBLEM_MESSAGES } from './problem.constant.ts'
import { GetJudge0LanguageId, pollBatchResults, submitBatch } from './problem.service.ts'
import { CreateProblemSchema } from './problem.validator.ts'

async function createProblem(req: Request, res: Response, next: NextFunction) {
  // get all data from req body
  const result = CreateProblemSchema.safeParse(req.body)
  if (!result.success) {
    throw new BadRequestException(JSON.stringify(result.error.flatten()))
  }
  const tReq = result.data

  // check user role again

  if (req.user?.role !== UserRole.ADMIN) {
    throw new UnauthorizedException(HTTP_STATUS_MESSAGES.Unauthorized)
  }
  let newProblem
  // loop through each reference solution for different languages
  try {
    for (const [language, solutionCode] of Object.entries(tReq.referenceSolution)) {
      const languageId = GetJudge0LanguageId(language)
      if (languageId === undefined) {
        throw new BadRequestException(PROBLEM_MESSAGES.LanguageNotSupported(language))
      }
      const submissions = tReq.testcases
        .map((testcase) => {
          return {
            source_code: solutionCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output,
          } as ISubmissions
        })

      const batchTokens = await submitBatch(submissions)
      const submissionTokens = batchTokens.map(batchToken => batchToken.token)
      const results = await pollBatchResults(submissionTokens)

      for (let i = 0; i < results.length; i++) {
        const result = results[i]

        if (result?.status_id !== 3) {
          return res.status(HTTP_STATUS_CODES.BadRequest)
            .json(
              new ApiResponse(
                HTTP_STATUS_CODES.BadRequest,
                { error: `Testcase ${i + 1} failed for language ${language}` },
              ),
            )
        }
      }
      // save the problem to the database
      if (req.user.id == null) {
        Logger.error('user id not found')
        throw new InternalServerErrorException(AUTH_MESSAGES.UserNotFound)
      }
      newProblem = await db.problem.create({
        data: {
          title: tReq.title,
          description: tReq.description,
          difficulty: tReq.difficulty as Difficulty,
          tags: tReq.tags,
          constraints: tReq.constraints,
          codeSnippets: tReq.codeSnippets,
          referenceSolution: tReq.referenceSolution,
          examples: tReq.examples, // rename to match Prisma schema
          testcases: tReq.testcases, // rename to match Prisma schema
          userId: req.user.id, // use nested relation
        },
      })
    }
    return res
      .status(HTTP_STATUS_CODES.Ok)
      .json(
        new ApiResponse(
          HTTP_STATUS_CODES.Ok,
          newProblem,
          PROBLEM_MESSAGES.ProblemCreatedSuccessfully,
        ),
      )
  }
  catch (error) {
    if (error instanceof UnauthorizedException
      || error instanceof BadRequestException
      || error instanceof InternalServerErrorException) {
      next(error)
    }
    Logger.error('unhandled error')
    if (error instanceof Error) {
      throw new TypeError(error.message, error)
    }
    throw new InternalServerErrorException()
  }
}

function getAllProblems(req: Request, res: Response) {

}

function getAllProblemById(req: Request, res: Response) {

}

function updateProblemById(req: Request, res: Response) {

}

function deleteProblemById(req: Request, res: Response) {

}
function getAllSolvedProblemsByUser(req: Request, res: Response) {

}

export { createProblem, deleteProblemById, getAllProblemById, getAllProblems, getAllSolvedProblemsByUser, updateProblemById }
