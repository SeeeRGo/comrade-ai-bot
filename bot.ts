import { Bot, Context, webhookCallback } from "grammy";
import express from "express";
import { openai } from './ai-api';
import { initPrompt } from './constants';
import { getRandomTokens } from './utils';
import dotenv from "dotenv";

dotenv.config()

const bot = new Bot(process.env.BOT_TOKEN || "");

bot.command('start', async (ctx: Context) => {
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

bot.on('message:text', async (ctx: Context) => {
  console.log('message', ctx.msg);
  
  const text = ctx.msg?.text;
  if (text) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: getRandomTokens(),
      messages: [{ role: "user", content: text }],
    });
    const response = completion.data.choices.at(0)?.message;
    if(response) {
      ctx.reply(response.content);
    }
  }
})

// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
