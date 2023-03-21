"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const ai_api_1 = require("./ai-api");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf((_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a.BOT_TOKEN) !== null && _b !== void 0 ? _b : '');
bot.start(async (ctx) => {
    var _a;
    const completion = await ai_api_1.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: (0, utils_1.getRandomTokens)(),
        messages: [{ role: "system", content: constants_1.initPrompt }],
    });
    const response = (_a = completion.data.choices.at(0)) === null || _a === void 0 ? void 0 : _a.message;
    if (response) {
        ctx.reply(response.content);
    }
});
bot.on('text', async (ctx) => {
    var _a, _b;
    const message = (_a = (0, telegraf_1.deunionize)(ctx.message)) === null || _a === void 0 ? void 0 : _a.text;
    if (message) {
        const completion = await ai_api_1.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: (0, utils_1.getRandomTokens)(),
            messages: [{ role: "user", content: message }],
        });
        const response = (_b = completion.data.choices.at(0)) === null || _b === void 0 ? void 0 : _b.message;
        if (response) {
            ctx.reply(response.content);
        }
    }
});
bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
