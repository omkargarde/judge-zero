"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateApp = void 0;
const express_1 = __importDefault(require("express"));
const route_1 = require("./routes/health/route");
const CreateApp = () => {
    const app = (0, express_1.default)();
    app.use((0, route_1.RegisterHealthRoutes)());
    return app;
};
exports.CreateApp = CreateApp;
