require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.OPENAI_API_KEY;

async function getChatGPTResponse(prompt) {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                }
            }
        );

        console.log("ChatGPT:", response.data.choices[0].message.content);
    } catch (error) {
    throw new Error('Failed to fetch base API URL');
  }
}

module.exports.config = {
  name: "gpt4",
  aliases: ["gpt", "st"],
  version: "1.0.0",
  role: 0,
  author: "ShAn",
  description: "Gpt4 AI with multiple conversation",
  usePrefix: true,
  guide: "[message]",
  category: "𝗔𝗜",
  countDown: 5,
};

module.exports.onReply = async function ({ api, event, Reply }) {
  const { author } = Reply;
  if (author !== event.senderID) return;

  const reply = event.body.toLowerCase();
  if (!isNaN(reply)) return;

  try {
    const response = await axios.get(`${await baseUrl()}/gpt4?text=${encodeURIComponent(reply)}&senderID=${author}`);
    const message = response.data.data;
    await api.sendMessage(message, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: 'reply',
        messageID: info.messageID,
        author: event.senderID,
        link: message
      });
    }, event.messageID);
  } catch (error) {
    console.error(error.message);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    const author = event.senderID;
    let query = args.join(" ").toLowerCase();

    if (!args[0]) {
      return api.sendMessage("Please provide a question to answer\n\nExample:\n!gpt4 hey", event.threadID, event.messageID);
    }

    // Default language is 'bn' (Bengali)
    if (!['bn', 'banglish', 'en'].includes(event.messageLanguage)) {
      query = 'bn ' + query;  // Ensure the query starts with default language 'bn'
    }

    const response = await axios.get(`${await baseUrl()}/gpt4?text=${encodeURIComponent(query)}&senderID=${author}`);
    const message = response.data.data;
    await api.sendMessage({ body: message }, event.threadID, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        type: 'reply',
        messageID: info.messageID,
        author,
        link: message
      });
    }, event.messageID);
  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
