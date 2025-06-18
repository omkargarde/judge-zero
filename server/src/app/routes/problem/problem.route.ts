import { Router } from 'express'
import { isAdmin, isLoggedIn } from '../auth/auth.middleware.ts'
import { createProblem, deleteProblemById, getAllProblemById, getAllProblems, getAllSolvedProblemsByUser, updateProblemById } from './problem.controller.ts'
import rateLimit from 'express-rate-limit'

const problemRouter: Router = Router()

const createProblemRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
})

problemRouter.post('/create-problem', createProblemRateLimiter, isLoggedIn, isAdmin, createProblem)
problemRouter.get('/get-all-problems', isLoggedIn, getAllProblems)
problemRouter.get('/get-problem/:id', isLoggedIn, getAllProblemById)
problemRouter.put('/update-problem/:id', isLoggedIn, isAdmin, updateProblemById)
problemRouter.delete('/delete-problem/:id', isLoggedIn, isAdmin, deleteProblemById)
problemRouter.get('/get-solved-problems', isLoggedIn, getAllSolvedProblemsByUser)

export { problemRouter }
