"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheck = void 0;
const status_constant_1 = require("../../constants/status.constant");
const api_response_util_1 = require("../../utils/api-response.util");
const HealthCheck = (req, res) => {
    res
        .status(status_constant_1.HTTP_STATUS_CODES.Ok)
        .json(new api_response_util_1.ApiResponse(status_constant_1.HTTP_STATUS_CODES.Ok, "", status_constant_1.HTTP_STATUS_MESSAGES.ServiceAvailable));
};
exports.HealthCheck = HealthCheck;
