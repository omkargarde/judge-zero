import antfu from '@antfu/eslint-config'
import { globalIgnores } from 'eslint/config'

export default antfu({
  ...globalIgnores(['./prisma/*', './generated/*']),
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})
