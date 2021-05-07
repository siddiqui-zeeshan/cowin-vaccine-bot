const TelegramBot = require("node-telegram-bot-api");
require('dotenv').config();
const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
  });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Received your message " + chatId);
});
var id = '920576132'
exports.sendNotification = async function(msg) {
    bot.sendMessage(id, msg);
}