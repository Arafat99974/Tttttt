/**
 * AutoDL Command - Fixed Version
 * Description: Downloads videos from social media with reliable on/off toggling
 * Version: 1.7.7
 */

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Configuration
const configPath = path.join(__dirname, 'autodl_config.json');
let isEnabled = true;

// Load saved config
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      isEnabled = savedConfig.isEnabled;
    }
  } catch (err) {
    console.error("Config load error:", err);
  }
}

// Save current state
function saveConfig() {
  try {
    fs.writeFileSync(configPath, JSON.stringify({ isEnabled }));
  } catch (err) {
    console.error("Config save error:", err);
  }
}

// Initialize
loadConfig();

module.exports.config = {
  name: "autodl",
  version: "1.7.7",
  hasPermssion: 0,
  credits: "Nazrul",
  description: "Download videos from social media",
  commandCategory: "media",
  usages: "autodl [on|off|status] or send URL",
  cooldowns: 10,
  dependencies: {
    "axios": ""
  }
};

// Required initialization
module.exports.onStart = function() {
  console.log("AutoDL initialized - Current state:", isEnabled ? "ON" : "OFF");
};

// Supported platforms
const platforms = {
  tiktok: {
    regex: /tiktok\.com/i,
    endpoint: "/nazrul/tikDL?url="
  },
  facebook: {
    regex: /(facebook\.com|fb\.watch)/i,
    endpoint: "/nazrul/fbDL?url="
  },
  youtube: {
    regex: /(youtube\.com|youtu\.be)/i,
    endpoint: "/nazrul/ytDL?uri="
  },
  twitter: {
    regex: /(x\.com|twitter\.com)/i,
    endpoint: "/nazrul/alldl?url="
  },
  instagram: {
    regex: /instagram\.com/i,
    endpoint: "/nazrul/instaDL?url="
  }
};

// Detect platform from URL
function getPlatform(url) {
  for (const [platform, { regex }] of Object.entries(platforms)) {
    if (regex.test(url)) return platform;
  }
  return null;
}

// Main command handler
module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, body } = event;

  // Handle command arguments
  if (args[0]) {
    const action = args[0].toLowerCase();
    
    if (action === 'on') {
      isEnabled = true;
      saveConfig();
      return api.sendMessage("🟢 AutoDL is now ENABLED", threadID, messageID);
    }
    
    if (action === 'off') {
      isEnabled = false;
      saveConfig();
      return api.sendMessage("🔴 AutoDL is now DISABLED", threadID, messageID);
    }
    
    if (action === 'status') {
      return api.sendMessage(
        `AutoDL status: ${isEnabled ? "🟢 ENABLED" : "🔴 DISABLED"}`,
        threadID,
        messageID
      );
    }
    
    return api.sendMessage(
      "Usage:\n• autodl on - Enable\n• autodl off - Disable\n• autodl status - Check status\n• Send URL to download",
      threadID,
      messageID
    );
  }

  // Check if command is disabled
  if (!isEnabled) {
    return api.sendMessage(
      "❌ AutoDL is currently disabled. Use 'autodl on' to enable.",
      threadID,
      messageID
    );
  }

  // Extract URL from message
  const urlMatch = body.match(/https?:\/\/[^\s]+/i);
  if (!urlMatch) return;

  const url = urlMatch[0];
  const platform = getPlatform(url);
  
  if (!platform) {
    return api.sendMessage(
      "❌ Unsupported platform. Supported: TikTok, Facebook, YouTube, Twitter, Instagram",
      threadID,
      messageID
    );
  }

  // Show loading indicator
  api.setMessageReaction("⏳", messageID, (err) => {}, true);

  try {
    // Get API endpoint
    const apiUrl = "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"; // Replace with actual API
    const endpoint = platforms[platform].endpoint;
    const fullUrl = `${apiUrl}${endpoint}${encodeURIComponent(url)}`;

    // Fetch video info
    const { data } = await axios.get(fullUrl, { timeout: 15000 });
    const videoUrl = data?.url || data?.videoUrl || data?.videos?.[0]?.url;
    
    if (!videoUrl) throw new Error("No video URL found");

    // Download the video
    const videoResponse = await axios.get(videoUrl, {
      responseType: "stream",
      timeout: 30000
    });

    // Send to chat
    await api.sendMessage({
      body: `✅ Downloaded from ${platform.charAt(0).toUpperCase() + platform.slice(1)}\n🔗 ${url}`,
      attachment: videoResponse.data
    }, threadID, messageID);

    // Show success
    api.setMessageReaction("✅", messageID, (err) => {}, true);

  } catch (error) {
    console.error("Download error:", error);
    api.sendMessage(
      `❌ Failed to download: ${error.message}`,
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, (err) => {}, true);
  }
};
