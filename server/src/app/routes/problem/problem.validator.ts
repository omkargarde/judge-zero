import { z } from 'zod'

const CreateProblemSchema = z.object({
  title: z.string({ required_error: 'title is required' }),
  description: z.string({ required_error: 'description is required' }),
  difficulty: z.string({ required_error: 'difficulty is required' }),
  tags: z.array(z.string({ required_error: 'tags is required' })),
  example: z.string({ required_error: 'example is required' }),
  constraints: z.string({ required_error: 'constraints is required' }),
  testCases: z.string({ required_error: 'test cases is required' }),
  codeSnippets: z.string({ required_error: 'code snippets is required' },

  ),
})

export { CreateProblemSchema }
