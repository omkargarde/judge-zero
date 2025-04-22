"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const http_1 = __importDefault(require("http"));
const logger_1 = require("./logger");
const app_1 = require("./app");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const PORT = Number((_a = env_1.Env.PORT) !== null && _a !== void 0 ? _a : 8000);
        const server = http_1.default.createServer((0, app_1.CreateApp)());
        server.listen(PORT, () => {
            logger_1.logger.info(`Server is listening on port:${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error("Error occurred while starting server: ", error);
        process.exit(1);
    }
});
main();
