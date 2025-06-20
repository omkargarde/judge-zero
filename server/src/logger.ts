import winston from 'winston'

import { IS_DEVOLVEMENT } from './app/constants/env.constant.ts'
import { Env } from './env.ts'

const Logger = winston.createLogger({
  format: winston.format.json(),
  level: 'info',
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
if (Env.NODE_ENV === IS_DEVOLVEMENT) {
  Logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

export { Logger }
