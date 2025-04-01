const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Configuration file path
const configPath = path.join(__dirname, 'autodl_config.json');

// Default state
let isEnabled = true;

// Load saved state
const loadConfig = () => {
  try {
    if (fs.existsSync(configPath)) {
      const savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      isEnabled = savedConfig.isEnabled !== false; // Default to true if not set
    }
  } catch (err) {
    console.error("Error loading config:", err);
  }
};

// Save current state
const saveConfig = () => {
  try {
    fs.writeFileSync(configPath, JSON.stringify({ isEnabled }, null, 2));
  } catch (err) {
    console.error("Error saving config:", err);
  }
};

// Initialize config
loadConfig();

const dApi = async () => {
  try {
    const base = await axios.get(
      "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json",
      { timeout: 10000 }
    );
    return base.data?.alldl;
  } catch (error) {
    console.error("Failed to fetch API config:", error.message);
    throw new Error("Failed to connect to download service");
  }
};

module.exports.config = {
  name: "autodl",
  version: "1.7.2",
  author: "Nazrul",
  role: 0,
  description: "Auto-download videos from supported platforms (toggle with on/off)",
  category: "𝗠𝗘𝗗𝗜𝗔",
  countDown: 5,
  guide: {
    en: "{pn} [on|off] - Toggle command\n{pn} <url> - Download video\nSupported: TikTok, FB, YT, Twitter, Instagram, Threads"
  },
};

module.exports.onStart = async ({}) => {
  console.log("AutoDL command initialized");
};

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
    endpoint: "/nazrul/ytDL?uri=",
  },
  Twitter: {
    regex: /(?:https?:\/\/)?(?:www\.)?x\.com/,
    endpoint: "/nazrul/alldl?url=",
  },
  Instagram: {
    regex: /(?:https?:\/\/)?(?:www\.)?instagram\.com/,
    endpoint: "/nazrul/instaDL?url=",
  },
  Threads: {
    regex: /(?:https?:\/\/)?(?:www\.)?threads\.net/,
    endpoint: "/nazrul/alldl?url=",
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
};

module.exports.onChat = async ({ api, event, args }) => {
  const { body, threadID, messageID } = event;

  // Check if message starts with the command prefix
  if (body && body.toLowerCase().startsWith("autodl")) {
    const command = args[0]?.toLowerCase();

    // Handle on/off commands
    if (command === 'off') {
      isEnabled = false;
      saveConfig();
      return api.sendMessage(
        "🔴 AutoDL command has been disabled",
        threadID,
        messageID
      );
    }
    else if (command === 'on') {
      isEnabled = true;
      saveConfig();
      return api.sendMessage(
        "🟢 AutoDL command has been enabled",
        threadID,
        messageID
      );
    }
    else if (command === 'status') {
      return api.sendMessage(
        `AutoDL is currently ${isEnabled ? "🟢 enabled" : "🔴 disabled"}`,
        threadID,
        messageID
      );
    }
  }

  // Check if command is disabled
  if (!isEnabled) {
    return api.sendMessage(
      "❌ AutoDL is currently disabled. Use 'autodl on' to enable.",
      threadID,
      messageID
    );
  }

  // Original URL processing functionality
  const urlMatch = body?.match(/https?:\/\/[^\s]+/);
  if (!urlMatch) return;

  const url = urlMatch[0];
  api.setMessageReaction("⏳", messageID, (err) => err && console.error(err), true);

  try {
    const apiUrl = await dApi();
    const { downloadUrl, platform } = await downloadVideo(apiUrl, url);
    
    const videoStream = await axios.get(downloadUrl, { 
      responseType: "stream",
      timeout: 30000
    });

    await api.sendMessage(
      {
        body: `✅ Downloaded from ${platform}\n🔗 Source: ${url}`,
        attachment: videoStream.data
      },
      threadID,
      messageID
    );
    
    api.setMessageReaction("✅", messageID, (err) => err && console.error(err), true);
  } catch (error) {
    console.error("Processing error:", error.message);
    api.sendMessage(
      `❌ Failed to download: ${error.message}`,
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, (err) => err && console.error(err), true);
  }
};
