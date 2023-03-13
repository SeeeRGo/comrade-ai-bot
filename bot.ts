import { Context, deunionize, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { openai } from './ai-api';
import { initPrompt } from './constants';
import { getRandomTokens } from './utils';
import dotenv from "dotenv";

dotenv.config()

const bot = new Telegraf(process.env?.BOT_TOKEN ?? '');

bot.start(async (ctx: Context) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: getRandomTokens(),
    messages: [{ role: "system", content: initPrompt }],
  });
  const response = completion.data.choices.at(0)?.message;
  if (response) {
    ctx.reply(response.content);
  }
});
bot.on('text', async (ctx: Context) => {
  const message = deunionize(ctx.message)?.text;
  if (message) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: getRandomTokens(),
      messages: [{ role: "user", content: message }],
    });
    const response = completion.data.choices.at(0)?.message;
    if(response) {
      ctx.reply(response.content);
    }
  }
})
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
