import http from "http";

import { CreateApp } from "./app/index.ts";
import { Env } from "./env.ts";
import { logger } from "./logger.ts";
const main = () => {
  try {
    const PORT = Number(Env.PORT ?? 8000);
    const server = http.createServer(CreateApp());
    server.listen(PORT, () => {
      logger.info(`Server is listening on port:${PORT}`);
    });
  } catch (error) {
    logger.error("Error occurred while starting server: ", error);
    process.exit(1);
  }
};

main();
