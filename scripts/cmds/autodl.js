/**
 * AutoDL Command
 * Description: Downloads videos from various social media platforms
 * Version: 1.7.5
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
    // Check if config file exists
    if (fs.existsSync(configPath)) {
      // Read and parse config file
      const savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      // Update enabled state (default to true if not set)
      isEnabled = savedConfig.isEnabled !== false;
    }
  } catch (err) {
    console.error("Error loading config:", err);
    // If error occurs, continue with default state
  }
}

/**
 * Saves current configuration to file
 */
function saveConfig() {
  try {
    // Write current state to config file
    fs.writeFileSync(configPath, JSON.stringify({ isEnabled }, null, 2));
  } catch (err) {
    console.error("Error saving config:", err);
  }
}

// Load config when module initializes
loadConfig();

// ============================================
// COMMAND CONFIGURATION
// ============================================

module.exports.config = {
  name: "autodl", // Command name
  version: "1.7.5", // Version number
  hasPermssion: 0, // Permission level (0 = all users)
  credits: "Nazrul", // Original author
  description: "Download videos from social media platforms", // Command description
  commandCategory: "media", // Command category
  usages: "autodl [on|off|status] or send URL", // Usage instructions
  cooldowns: 10 // Cooldown in seconds
};

// ============================================
// PLATFORM CONFIGURATION
// ============================================

/**
 * Supported platforms and their configurations
 */
const platforms = {
  TikTok: {
    regex: /tiktok\.com/i, // Regex to match TikTok URLs
    endpoint: "/nazrul/tikDL?url=" // API endpoint for TikTok
  },
  Facebook: {
    regex: /(facebook\.com|fb\.watch)/i, // Regex for Facebook
    endpoint: "/nazrul/fbDL?url=" // API endpoint
  },
  YouTube: {
    regex: /(youtube\.com|youtu\.be)/i, // Regex for YouTube
    endpoint: "/nazrul/ytDL?uri=" // API endpoint
  },
  Twitter: {
    regex: /(x\.com|twitter\.com)/i, // Regex for Twitter
    endpoint: "/nazrul/alldl?url=" // API endpoint
  },
  Instagram: {
    regex: /instagram\.com/i, // Regex for Instagram
    endpoint: "/nazrul/instaDL?url=" // API endpoint
  },
  Threads: {
    regex: /threads\.net/i, // Regex for Threads
    endpoint: "/nazrul/alldl?url=" // API endpoint
  }
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Detects which platform a URL belongs to
 * @param {string} url - The URL to check
 * @returns {object|null} Platform info or null if unsupported
 */
function detectPlatform(url) {
  if (!url) return null;
  
  // Check URL against all supported platforms
  for (const [platform, { regex, endpoint }] of Object.entries(platforms)) {
    if (regex.test(url)) {
      return { platform, endpoint };
    }
  }
  return null; // No match found
}

/**
 * Downloads video from a URL using the appropriate API
 * @param {string} apiUrl - Base API URL
 * @param {string} url - Video URL to download
 * @returns {object} Contains download URL and platform name
 */
async function downloadVideo(apiUrl, url) {
  // Detect which platform this URL belongs to
  const match = detectPlatform(url);
  if (!match) throw new Error("Unsupported platform");

  try {
    // Construct full API URL
    const fullUrl = `${apiUrl}${match.endpoint}${encodeURIComponent(url)}`;
    
    // Make request to download API
    const { data } = await axios.get(fullUrl, { timeout: 15000 });
    
    // Extract video URL from response
    const videoUrl = data?.videos?.[0]?.url || data?.url;
    if (!videoUrl) throw new Error("No video found in response");
    
    return { 
      downloadUrl: videoUrl, 
      platform: match.platform 
    };
  } catch (error) {
    console.error(`Download failed (${match.platform}):`, error.message);
    throw new Error(`Failed to download from ${match.platform}`);
  }
}

/**
 * Fetches the API base URL from GitHub
 * @returns {string} API base URL
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
// COMMAND HANDLER
// ============================================

/**
 * Main command handler
 */
module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  // ============================================
  // COMMAND MODE (on/off/status)
  // ============================================
  if (args.length > 0) {
    const action = args[0].toLowerCase();
    
    // Enable command
    if (action === 'on') {
      isEnabled = true;
      saveConfig();
      return api.sendMessage("🟢 AutoDL is now ENABLED", threadID, messageID);
    }
    
    // Disable command
    else if (action === 'off') {
      isEnabled = false;
      saveConfig();
      return api.sendMessage("🔴 AutoDL is now DISABLED", threadID, messageID);
    }
    
    // Check status
    else if (action === 'status') {
      return api.sendMessage(
        `AutoDL status: ${isEnabled ? "🟢 ENABLED" : "🔴 DISABLED"}`,
        threadID,
        messageID
      );
    }
    
    // Show help
    else {
      return api.sendMessage(
        "📝 AutoDL Help:\n\n" +
        "• autodl on - Enable downloads\n" +
        "• autodl off - Disable downloads\n" +
        "• autodl status - Check current status\n" +
        "• Send a supported URL to download\n\n" +
        "Supported platforms: TikTok, Facebook, YouTube, Twitter, Instagram, Threads",
        threadID,
        messageID
      );
    }
  }

  // ============================================
  // URL PROCESSING MODE
  // ============================================
  
  // Check if command is disabled
  if (!isEnabled) {
    return api.sendMessage(
      "❌ AutoDL is currently disabled. Use 'autodl on' to enable.",
      threadID,
      messageID
    );
  }

  // Extract URL from message
  const urlMatch = event.body?.match(/https?:\/\/[^\s]+/i);
  if (!urlMatch) return; // No URL found

  const url = urlMatch[0];
  
  // Show loading reaction
  await api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    // Get API base URL
    const apiUrl = await getApiBaseUrl();
    
    // Download video info
    const { downloadUrl, platform } = await downloadVideo(apiUrl, url);
    
    // Download the actual video
    const { data } = await axios.get(downloadUrl, {
      responseType: "stream",
      timeout: 30000
    });

    // Send video to chat
    await api.sendMessage({
      body: `✅ Success! Downloaded from ${platform}\n🔗 ${url}`,
      attachment: data
    }, threadID, messageID);
    
    // Show success reaction
    await api.setMessageReaction("✅", messageID, () => {}, true);
    
  } catch (error) {
    console.error("Download error:", error.message);
    
    // Send error message
    await api.sendMessage(
      `❌ Download failed: ${error.message}`,
      threadID,
      messageID
    );
    
    // Show error reaction
    await api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

/**
 * Initialization function
 */
module.exports.onLoad = function() {
  console.log("AutoDL command loaded");
};
