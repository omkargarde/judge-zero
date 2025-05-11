import { CreateApp } from "./app/index.ts";
import { Env } from "./env.ts";
import { Logger } from "./logger.ts";

const main = () => {
  try {
    let port: number;
    if (Env.PORT) {
      port = Number(Env.PORT);
    } else {
      port = 8000;
    }
    const server = CreateApp();
    server.listen(port, () => {
      Logger.info(`Server is listening on port:${port.toString()}`);
    });
  } catch (error) {
    Logger.error("Error occurred while starting server: ", error);
    process.exit(1);
  }
};

main();
