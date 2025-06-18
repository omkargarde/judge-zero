import type { NextFunction, Request, Response } from 'express'
import type { Difficulty } from '../../../../generated/prisma/index.js'
import type { ISubmissions } from './problem.type.ts'
import { loggers } from 'winston'
import { UserRole } from '../../../../generated/prisma/index.js'
import { db } from '../../../libs/db.ts'

import { Logger } from '../../../logger.ts'
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES } from '../../constants/status.constant.ts'
import { ApiResponse } from '../../utils/api-response.util.ts'
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '../../utils/error.util.ts'
import { AUTH_MESSAGES } from '../auth/auth.constant.ts'
import { JUDGE0_STATUS, PROBLEM_MESSAGES } from './problem.constant.ts'
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
  Logger.info('checking if user is authorized\n', req.user)
  if (req.user?.role !== UserRole.ADMIN) {
    throw new UnauthorizedException(HTTP_STATUS_MESSAGES.Unauthorized)
  }
  Logger.info('user is authorized\n')
  // loop through each reference solution for different languages
  try {
    for (const [language, solutionCode] of Object.entries(tReq.referenceSolution)) {
      Logger.info('fetching language id\n')
      const languageId = GetJudge0LanguageId(language)
      if (languageId === undefined) {
        throw new BadRequestException(PROBLEM_MESSAGES.LanguageNotSupported(language))
      }
      Logger.info(`fetched id for ${language}:${languageId}`)
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
      const submissionTokens = batchTokens.map(
        batchToken => batchToken.token,
      )
      Logger.info('polling batch')
      const results = await pollBatchResults(submissionTokens)

      for (let i = 0; i < results.length; i++) {
        Logger.info('results:: ', results[i])
        const result = results[i]
        if (result === undefined) {
          throw new BadRequestException(`Testcase ${i + 1} failed for language ${language}`)
        }
        if (result.status_id !== JUDGE0_STATUS.Accepted) {
          throw new BadRequestException(`Testcase ${i + 1} failed for language ${language}`)
        }
      }
    }
    // save the problem to the database
    if (req.user.id == null) {
      Logger.error('user id not found')
      throw new InternalServerErrorException(AUTH_MESSAGES.UserNotFound)
    }
    const newProblem = await db.problem.create({
      data: {
        title: tReq.title,
        description: tReq.description,
        difficulty: tReq.difficulty as Difficulty,
        tags: tReq.tags,
        constraints: tReq.constraints,
        codeSnippets: tReq.codeSnippets,
        referenceSolution: tReq.referenceSolution,
        examples: tReq.examples,
        testcases: tReq.testcases,
        userId: req.user.id,
      },
    })
    res
      .status(HTTP_STATUS_CODES.Created)
      .json(
        new ApiResponse(
          HTTP_STATUS_CODES.Created,
          newProblem,
          PROBLEM_MESSAGES.ProblemCreatedSuccessfully,
        ),
      )
  }
  catch (error) {
    Logger.error('unhandled error', error)
    return next(new InternalServerErrorException())
  }
}

function getAllProblems(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

function getAllProblemById(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

function updateProblemById(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

function deleteProblemById(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

function getAllSolvedProblemsByUser(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

export { createProblem, deleteProblemById, getAllProblemById, getAllProblems, getAllSolvedProblemsByUser, updateProblemById }
