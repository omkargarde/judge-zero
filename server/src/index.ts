import http from "http";

import { CreateApp } from "./app/index.ts";
import { Env } from "./env.ts";
import { logger } from "./logger.ts";

const main = () => {
  try {
    let PORT: number;
    if (Env.PORT) {
      PORT = Env.PORT;
    } else {
      PORT = 8000;
    }

    const server = http.createServer();
    server.listen(PORT, () => {
      CreateApp();
      logger.info(`Server is listening on port:${PORT.toString()}`);
    });
  } catch (error) {
    logger.error("Error occurred while starting server: ", error);
    process.exit(1);
  }
};

main();
