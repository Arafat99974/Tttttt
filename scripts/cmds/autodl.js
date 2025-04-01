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
  role: 1, // Changed to 1 to restrict to admin (adjust as needed)
  description: "Automatically download videos from supported platforms!",
  category: "𝗠𝗘𝗗𝗜𝗔",
  countDown: 10,
  guide: {
    en: "{pn} [on|off] - Turn auto-downloader on/off\nOr send a video link to download",
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
  if (args[0] === "on" || args[0] === "off") {
    // Check if user has permission (role 1 is admin)
    if (this.config.role > 0) {
      const permission = await checkPermission(api, event.senderID);
      if (!permission) {
        return api.sendMessage("⚠️ You don't have permission to use this command.", threadID, messageID);
      }
    }

    autodlEnabled = args[0] === "on";
    return api.sendMessage(
      `✅ Auto-downloader is now ${autodlEnabled ? "ENABLED" : "DISABLED"}`,
      threadID,
      messageID
    );
  }

  // If autodl is disabled, ignore video links
  if (!autodlEnabled) return;

  // Original URL handling
  const urlMatch = body.match(/https?:\/\/[^\s]+/);
  if (!urlMatch) return;
  
  api.setMessageReaction("🤷🏻‍♂️", event.messageID, (err) => {}, true);
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
        body: `✅ Successfully downloaded the video!\n🔖 Platform: ${platform}\n😜Power by Ew'r ShAn's😪`,
        attachment: [videoStream.data],
      },
      threadID,
      messageID
    );
  } catch (error) {
    console.error(`❌ Error while processing the URL:`, error.message);
  }
};

// Helper function to check permissions (compatible with Goat-Bot-V2)
async function checkPermission(api, senderID) {
  try {
    const adminIDs = await api.getThreadAdministrators(api.getCurrentUserID());
    return adminIDs.includes(senderID);
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}
