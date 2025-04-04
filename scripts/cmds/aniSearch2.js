const { GoatWrapper } = require('fca-liane-utils');
const a = require("axios");

module.exports = {
  config: {
    name: "aniSearch2",
    aliases: ["animeSearch2", "anisearch2"],
    version: "1.6.9",
    author: "𝗦𝗵𝗔𝗻",
    role: 0,
    description: "Search for anime videos",
    category: "𝗠𝗘𝗗𝗜𝗔",
    countDown: 5,
    guide: { en: "{pn} anime name" }
  },

  onStart: async ({ api, event, args }) => {
    if (!args.length) return api.sendMessage("Provide an anime name.", event.threadID, event.messageID);

    try {
      const { data } = await a.get(`https://nazrul-xyz.vercel.app/nazrul/aniSearch`, { params: { query: args.join(" ") } });
      const v = data.data.videos[0].play;

      if (v) {
        api.sendMessage(
          { body: "Here's your anime video", attachment: await global.utils.getStreamFromURL(v) },event.threadID,event.messageID);
      } else {
        api.sendMessage("No videos found.", event.threadID, event.messageID);
      }
    } catch (e) {
      api.sendMessage(`error: ${e.message}`, event.threadID, event.messageID);
    }
  }
};
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
