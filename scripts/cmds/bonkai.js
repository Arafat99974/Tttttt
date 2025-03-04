const axios = require("axios");

module.exports = {
  config: {
    name: "jugram",
    aliases: ["pek"],
    version: "1.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 5,
    role: 0,
    shortDescription: "Chat with GPT",
    longDescription: "Chat with a GPT model using rehatdesu.xyz API",
    category: "𝗔𝗜-𝗖𝗛𝗔𝗧",
    guide: {
      en: "{p}chatgpt <message>"
    }
  },

  onStart: async function ({ message, event, args }) {
    if (args.length === 0) {
      return message.reply("Please provide a message to send to GPT.");
    }

    const userMessage = args.join(" ");
    const apiUrl = `https://rehatdesu.xyz/api/llm/gpt?query=${encodeURIComponent(userMessage)}`;

    try {
      const response = await axios.get(apiUrl);
      const { data } = response;

      if (data && data.response) {
        return message.reply(data.response);
      } else {
        throw new Error("Invalid response from the API");
      }
    } catch (error) {
      console.error(error);
      return message.reply("❌ An error occurred while communicating with GPT.");
    }
  }
};
