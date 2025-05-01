import type { Request, Response } from "express";

import {
  HTTP_STATUS_CODES,
  HTTP_STATUS_MESSAGES,
} from "../../constants/status.constant.ts";
import { ApiResponse } from "../../utils/api-response.util.ts";

const HealthCheck = (req: Request, res: Response) => {
  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(
        HTTP_STATUS_CODES.Ok,
        "",
        HTTP_STATUS_MESSAGES.ServiceAvailable
      )
    );
};

export { HealthCheck };
