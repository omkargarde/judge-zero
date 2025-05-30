import process from 'node:process'
import { app } from './app/index.ts'
import { Env } from './env.ts'
import { Logger } from './logger.ts'

function main() {
  try {
    let port: number
    if (Env.PORT) {
      port = Number(Env.PORT)
    }
    else {
      port = 8000
    }
    app.listen(port, () => {
      Logger.info(`Server is listening on port:${port.toString()}`)
    })
  }
  catch (error) {
    Logger.error('Error occurred while starting server: ', error)
    process.exit(1)
  }
}

main()
