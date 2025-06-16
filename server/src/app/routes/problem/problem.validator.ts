import { z } from 'zod'

const CreateProblemSchema = z.object({
  title: z.string({ required_error: 'title is required' }),
  description: z.string({ required_error: 'description is required' }),
  difficulty: z.string({ required_error: 'difficulty is required' }),
  tags: z.array(z.string({ required_error: 'tags is required' })),
  examples: z.object(
    { input: z.string(), output: z.string(), explanation: z.string() },
  ),
  constraints: z.string({ required_error: 'constraints is required' }),
  testcases: z.array(
    z.object({
      input: z.string().min(1, 'Test case input cannot be empty'),
      output: z.string().min(1, 'Test case output cannot be empty'),
    }),
    { required_error: 'Test cases are required' },
  ).min(1, 'At least one test case is required'),
  codeSnippets: z.record(
    z.string(),
    { required_error: 'code snippet is required' },
  ),
  referenceSolution: z.record(
    z.string(),
    { required_error: 'reference solution is required' },
  ),

})

export { CreateProblemSchema }
