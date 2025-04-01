const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Configuration
const configPath = path.join(__dirname, 'autodl_config.json');
let isEnabled = true;

// Load config
const loadConfig = () => {
  try {
    if (fs.existsSync(configPath)) {
      const savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      isEnabled = savedConfig.isEnabled !== false;
    }
  } catch (err) {
    console.error("Config load error:", err);
  }
};

// Save config
const saveConfig = () => {
  try {
    fs.writeFileSync(configPath, JSON.stringify({ isEnabled }, null, 2));
  } catch (err) {
    console.error("Config save error:", err);
  }
};

// Initialize
loadConfig();

// API fetcher
const dApi = async () => {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json",
      { timeout: 10000 }
    );
    return data?.alldl;
  } catch (error) {
    console.error("API fetch failed:", error.message);
    throw new Error("Service unavailable");
  }
};

module.exports.config = {
  name: "autodl",
  version: "1.7.3",
  author: "Nazrul",
  role: 0,
  description: "Download videos from social media (Toggle with on/off)",
  category: "𝗠𝗘𝗗𝗜𝗔",
  countDown: 5,
  guide: {
    en: "{prefix}autodl on|off|status\n{prefix}autodl <url>"
  },
};

module.exports.onStart = async () => {
  console.log("AutoDL ready");
};

// Supported platforms
const platforms = {
  TikTok: {
    regex: /tiktok\.com/i,
    endpoint: "/nazrul/tikDL?url="
  },
  Facebook: {
    regex: /(facebook\.com|fb\.watch)/i,
    endpoint: "/nazrul/fbDL?url="
  },
  YouTube: {
    regex: /(youtube\.com|youtu\.be)/i,
    endpoint: "/nazrul/ytDL?uri="
  },
  Twitter: {
    regex: /(x\.com|twitter\.com)/i, 
    endpoint: "/nazrul/alldl?url="
  },
  Instagram: {
    regex: /instagram\.com/i,
    endpoint: "/nazrul/instaDL?url="
  },
  Threads: {
    regex: /threads\.net/i,
    endpoint: "/nazrul/alldl?url="
  }
};

// Platform detector
const detectPlatform = (url) => {
  if (!url) return null;
  for (const [platform, { regex, endpoint }] of Object.entries(platforms)) {
    if (regex.test(url)) return { platform, endpoint };
  }
  return null;
};

// Download processor
const downloadVideo = async (apiUrl, url) => {
  const match = detectPlatform(url);
  if (!match) throw new Error("Unsupported platform");

  try {
    const { data } = await axios.get(
      `${apiUrl}${match.endpoint}${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );
    
    const videoUrl = data?.videos?.[0]?.url || data?.url;
    if (!videoUrl) throw new Error("No video found");
    
    return { 
      downloadUrl: videoUrl, 
      platform: match.platform 
    };
  } catch (error) {
    console.error(`Download failed (${match.platform}):`, error.message);
    throw new Error(`Failed to download from ${match.platform}`);
  }
};

// Main handler
module.exports.onChat = async ({ api, event, args }) => {
  const { body, threadID, messageID } = event;

  // Command handler
  if (body?.toLowerCase().startsWith("autodl")) {
    const [cmd, action] = body.toLowerCase().split(/\s+/);
    
    if (action === 'off') {
      isEnabled = false;
      saveConfig();
      return api.sendMessage(
        "🔴 AutoDL is now DISABLED",
        threadID,
        messageID
      );
    }
    
    if (action === 'on') {
      isEnabled = true;
      saveConfig();
      return api.sendMessage(
        "🟢 AutoDL is now ENABLED", 
        threadID,
        messageID
      );
    }
    
    if (action === 'status') {
      return api.sendMessage(
        `AutoDL status: ${isEnabled ? "🟢 ENABLED" : "🔴 DISABLED"}`,
        threadID,
        messageID
      );
    }
    
    // Show help if no valid action
    return api.sendMessage(
      `Usage:\n• autodl on - Enable\n• autodl off - Disable\n• autodl status - Check status\n• Send URL to download`,
      threadID,
      messageID
    );
  }

  // Download handler
  if (!isEnabled) return; // Skip if disabled

  const urlMatch = body?.match(/https?:\/\/[^\s]+/i);
  if (!urlMatch) return;

  const url = urlMatch[0];
  await api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const apiUrl = await dApi();
    const { downloadUrl, platform } = await downloadVideo(apiUrl, url);
    
    const { data } = await axios.get(downloadUrl, {
      responseType: "stream",
      timeout: 30000
    });

    await api.sendMessage({
      body: `✅ ${platform} video downloaded!\n🔗 ${url}`,
      attachment: data
    }, threadID, messageID);
    
    await api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (error) {
    console.error("Download error:", error.message);
    await api.sendMessage(
      `❌ Download failed: ${error.message}`,
      threadID,
      messageID
    );
    await api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
