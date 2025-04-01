/**
 * AutoDL Command
 * Description: Downloads videos from various social media platforms
 * Version: 1.7.6
 * Author: Nazrul (modified by assistant)
 */

// Required modules
const axios = require("axios"); // For making HTTP requests
const fs = require("fs"); // For file system operations
const path = require("path"); // For path handling

// ============================================
// CONFIGURATION SETUP
// ============================================

// Path to config file (stores enabled/disabled state)
const configPath = path.join(__dirname, 'autodl_config.json');

// Default state (true = enabled, false = disabled)
let isEnabled = true;

// ============================================
// CONFIGURATION FUNCTIONS
// ============================================

/**
 * Loads configuration from file
 */
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      isEnabled = savedConfig.isEnabled !== false;
    }
  } catch (err) {
    console.error("Error loading config:", err);
  }
}

/**
 * Saves current configuration to file
 */
function saveConfig() {
  try {
    fs.writeFileSync(configPath, JSON.stringify({ isEnabled }, null, 2));
  } catch (err) {
    console.error("Error saving config:", err);
  }
}

// ============================================
// COMMAND CONFIGURATION
// ============================================

module.exports.config = {
  name: "autodl",
  version: "1.7.6",
  hasPermssion: 0,
  credits: "Nazrul",
  description: "Download videos from social media platforms",
  commandCategory: "media",
  usages: "autodl [on|off|status] or send URL",
  cooldowns: 10
};

// ============================================
// REQUIRED INITIALIZATION FUNCTION
// ============================================

/**
 * Required onStart function - runs when command loads
 */
module.exports.onStart = async function() {
  console.log("AutoDL command initializing...");
  loadConfig(); // Load saved configuration
  console.log(`AutoDL started in ${isEnabled ? "ENABLED" : "DISABLED"} state`);
};

// ============================================
// PLATFORM CONFIGURATION
// ============================================

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

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Detects which platform a URL belongs to
 */
function detectPlatform(url) {
  if (!url) return null;
  for (const [platform, { regex, endpoint }] of Object.entries(platforms)) {
    if (regex.test(url)) return { platform, endpoint };
  }
  return null;
}

/**
 * Downloads video from a URL using the appropriate API
 */
async function downloadVideo(apiUrl, url) {
  const match = detectPlatform(url);
  if (!match) throw new Error("Unsupported platform");

  try {
    const fullUrl = `${apiUrl}${match.endpoint}${encodeURIComponent(url)}`;
    const { data } = await axios.get(fullUrl, { timeout: 15000 });
    const videoUrl = data?.videos?.[0]?.url || data?.url;
    if (!videoUrl) throw new Error("No video found in response");
    return { downloadUrl: videoUrl, platform: match.platform };
  } catch (error) {
    console.error(`Download failed (${match.platform}):`, error.message);
    throw new Error(`Failed to download from ${match.platform}`);
  }
}

/**
 * Fetches the API base URL from GitHub
 */
async function getApiBaseUrl() {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json",
      { timeout: 10000 }
    );
    return data?.alldl;
  } catch (error) {
    console.error("API config fetch failed:", error.message);
    throw new Error("Download service unavailable");
  }
}

// ============================================
// MAIN COMMAND HANDLER
// ============================================

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  // Command mode (on/off/status)
  if (args.length > 0) {
    const action = args[0].toLowerCase();
    
    if (action === 'on') {
      isEnabled = true;
      saveConfig();
      return api.sendMessage("🟢 AutoDL is now ENABLED", threadID, messageID);
    }
    else if (action === 'off') {
      isEnabled = false;
      saveConfig();
      return api.sendMessage("🔴 AutoDL is now DISABLED", threadID, messageID);
    }
    else if (action === 'status') {
      return api.sendMessage(
        `AutoDL status: ${isEnabled ? "🟢 ENABLED" : "🔴 DISABLED"}`,
        threadID,
        messageID
      );
    }
    else {
      return api.sendMessage(
        "📝 AutoDL Help:\n\n• autodl on - Enable\n• autodl off - Disable\n• autodl status - Check status\n• Send URL to download",
        threadID,
        messageID
      );
    }
  }

  // URL processing mode
  if (!isEnabled) {
    return api.sendMessage(
      "❌ AutoDL is currently disabled. Use 'autodl on' to enable.",
      threadID,
      messageID
    );
  }

  const urlMatch = event.body?.match(/https?:\/\/[^\s]+/i);
  if (!urlMatch) return;

  const url = urlMatch[0];
  await api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const apiUrl = await getApiBaseUrl();
    const { downloadUrl, platform } = await downloadVideo(apiUrl, url);
    const { data } = await axios.get(downloadUrl, {
      responseType: "stream",
      timeout: 30000
    });

    await api.sendMessage({
      body: `✅ Downloaded from ${platform}\n🔗 ${url}`,
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
