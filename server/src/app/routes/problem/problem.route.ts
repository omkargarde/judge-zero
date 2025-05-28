import { Router } from 'express'
import { isAdmin, isLoggedIn } from '../auth/auth.middleware.ts'
import { createProblem, deleteProblemById, getAllProblemById, getAllProblems, getAllSolvedProblems, updateProblemById } from './problem.controller.ts'

const problemRouter: Router = Router()

problemRouter.post('/create-problem', isLoggedIn, isAdmin, createProblem)
problemRouter.get('/get-all-problems', isLoggedIn, getAllProblems)
problemRouter.get('get-problem/:id', isLoggedIn, getAllProblemById)
problemRouter.put('update-problem/:id', isLoggedIn, isAdmin, updateProblemById)
problemRouter.delete('delete-problem/:id', isLoggedIn, isAdmin, deleteProblemById)
problemRouter.get('/get-solved-problems', isLoggedIn, getAllSolvedProblems)

export { problemRouter }
