const axios = require("axios");

// Global state to track if autodl is enabled
let autodlEnabled = true;

const dApi = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return base.data.alldl;
};

module.exports.config = {
  name: "autodl",
  version: "1.6.9",
  author: "Nazrul",
  role: 0, // Kept at 0 for no restrictions
  description: "Automatically download videos from supported platforms!",
  category: "𝗠𝗘𝗗𝗜𝗔",
  countDown: 10,
  guide: {
    en: "To toggle: {pn} on/off\nOr send a video link to download",
  },
};

module.exports.onStart = ({}) => {};

const platforms = {
TikTok: {
    regex: /(?:https?:\/\/)?(?:www\.)?tiktok\.com/,
    endpoint: "/nazrul/tikDL?url=",
  },
  Facebook: {
    regex: /(?:https?:\/\/)?(?:www\.)?(facebook\.com|fb\.watch|facebook\.com\/share\/v)/,
    endpoint: "/nazrul/fbDL?url=",
  },
  YouTube: {
    regex: /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)/,
    endpoint: "/nazrul/ytDL?url=",
  },
  Twitter: {
    regex: /(?:https?:\/\/)?(?:www\.)?twitter\.com/,
    endpoint: "/nazrul/alldl?url=",
  },
  Instagram: {
    regex: /(?:https?:\/\/)?(?:www\.)?instagram\.com/,
    endpoint: "/nazrul/instaDL?url=",
  },
};

const detectPlatform = (url) => {
for (const [platform, data] of Object.entries(platforms)) {
    if (data.regex.test(url)) {
      return { platform, endpoint: data.endpoint };
    }
  }
  return null;
};

const downloadVideo = async (apiUrl, url) => {
const match = detectPlatform(url);
  if (!match) {
    throw new Error("No matching platform for the provided URL.");
  }

  const { platform, endpoint } = match;
  const endpointUrl = `${apiUrl}${endpoint}${encodeURIComponent(url)}`;
  console.log(`🔗 Fetching from: ${endpointUrl}`);

  try {
    const res = await axios.get(endpointUrl);
    console.log(`✅ API Response:`, res.data);

    const videoUrl = res.data?.videos?.[0]?.url || res.data?.url;
    if (videoUrl) {
      return { downloadUrl: videoUrl, platform };
    }
  } catch (error) {
    console.error(`❌ Error fetching data from ${endpointUrl}:`, error.message);
    throw new Error("Download link not found.");
  }
  throw new Error("No video URL found in the API response.");
};

module.exports.onChat = async ({ api, event, args }) => {
  const { body, threadID, messageID } = event;

  if (!body) return;

  // Handle on/off commands
  if (args[0]?.toLowerCase() === "on" || args[0]?.toLowerCase() === "off") {
    autodlEnabled = args[0].toLowerCase() === "on";
    return api.sendMessage(
      `⚡ Auto-downloader is now ${autodlEnabled ? "ENABLED" : "DISABLED"}`,
      threadID,
      messageID
    );
  }

  // If autodl is disabled, ignore video links
  if (!autodlEnabled) {
    api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    return;
  }

  // Original URL handling
  const urlMatch = body.match(/https?:\/\/[^\s]+/);
  if (!urlMatch) return;
  
  api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
  const url = urlMatch[0];

  const platformMatch = detectPlatform(url);
  if (!platformMatch) return;

  try {
    const apiUrl = await dApi();
    api.setMessageReaction("✔️", event.messageID, (err) => {}, true);
    const { downloadUrl, platform } = await downloadVideo(apiUrl, url);

    const videoStream = await axios.get(downloadUrl, { responseType: "stream" });
    api.sendMessage(
      {
        body: `✅ Successfully downloaded the video!\n🔖 Platform: ${platform}\nStatus: ${autodlEnabled ? "ON" : "OFF"}\n😜 Power by Ew'r ShAn's 😪`,
        attachment: [videoStream.data],
      },
      threadID,
      messageID
    );
  } catch (error) {
    api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    console.error(`❌ Error while processing the URL:`, error.message);
  }
};
