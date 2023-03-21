"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const express_1 = __importDefault(require("express"));
const ai_api_1 = require("./ai-api");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN || "");
bot.command('start', async (ctx) => {
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
bot.on('message:text', async (ctx) => {
    var _a, _b;
    console.log('message', ctx.msg);
    const text = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text;
    if (text) {
        const completion = await ai_api_1.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: (0, utils_1.getRandomTokens)(),
            messages: [{ role: "user", content: text }],
        });
        const response = (_b = completion.data.choices.at(0)) === null || _b === void 0 ? void 0 : _b.message;
        if (response) {
            ctx.reply(response.content);
        }
    }
});
// Start the server
if (process.env.NODE_ENV === "production") {
    // Use Webhooks for the production server
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
}
else {
    // Use Long Polling for development
    bot.start();
}
