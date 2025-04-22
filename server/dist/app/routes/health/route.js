"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterHealthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const RegisterHealthRoutes = () => {
    const router = express_1.default.Router();
    router.get("/", controller_1.HealthCheck);
    return router;
};
exports.RegisterHealthRoutes = RegisterHealthRoutes;
