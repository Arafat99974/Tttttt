const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Persistent state storage
const stateFilePath = path.join(__dirname, 'autodl_state.json');

// Initialize or load state
let moduleState = {
  isEnabled: true,
  disabledThreads: new Set(),
  adminOnly: false
};

// Load saved state if exists
if (fs.existsSync(stateFilePath)) {
  const savedState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
  moduleState.isEnabled = savedState.isEnabled;
  moduleState.disabledThreads = new Set(savedState.disabledThreads || []);
  moduleState.adminOnly = savedState.adminOnly || false;
}

const saveState = () => {
  fs.writeFileSync(stateFilePath, JSON.stringify({
    isEnabled: moduleState.isEnabled,
    disabledThreads: Array.from(moduleState.disabledThreads),
    adminOnly: moduleState.adminOnly
  }), 'utf8');
};

const dApi = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return base.data.alldl;
};

module.exports.config = {
  name: "autodown",
  version: "1.7.0",
  author: "𝗦𝗵𝗔𝗻",
  role: 0,
  description: "Auto-download videos with advanced controls (on/off/per-thread/admin)",
  category: "𝗠𝗘𝗗𝗜𝗔",
  countDown: 10,
  guide: {
    en: `Commands:
- {prefix}autodown on - Enable globally
- {prefix}autodown off - Disable globally
- {prefix}autodown thread on - Enable for this thread
- {prefix}autodown thread off - Disable for this thread
- {prefix}autodown admin on - Restrict to admins only
- {prefix}autodown admin off - Allow all users
- {prefix}autodown status - Show current settings`
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

const isAdmin = (senderID) => {
  // Implement your admin check logic here
  // This is just a placeholder - replace with your actual admin check
  return global.adminList.includes(senderID);
};

module.exports.onChat = async ({ api, event, args }) => {
  const { body, threadID, messageID, senderID } = event;

  if (!body) return;

  // Handle commands
  if (args.length > 0) {
    const command = args[0].toLowerCase();
    const subCommand = args[1]?.toLowerCase();

    // Global on/off
    if (command === 'on' && !subCommand) {
      if (moduleState.adminOnly && !isAdmin(senderID)) {
        return api.sendMessage("❌ Only admins can change global settings", threadID, messageID);
      }
      moduleState.isEnabled = true;
      saveState();
      return api.sendMessage("✅ Auto-download module is now ENABLED globally", threadID, messageID);
    }

    if (command === 'off' && !subCommand) {
      if (moduleState.adminOnly && !isAdmin(senderID)) {
        return api.sendMessage("❌ Only admins can change global settings", threadID, messageID);
      }
      moduleState.isEnabled = false;
      saveState();
      return api.sendMessage("❌ Auto-download module is now DISABLED globally", threadID, messageID);
    }

    // Thread-specific on/off
    if (command === 'thread' && subCommand) {
      if (subCommand === 'on') {
        moduleState.disabledThreads.delete(threadID);
        saveState();
        return api.sendMessage("✅ Auto-download enabled for this thread", threadID, messageID);
      }
      if (subCommand === 'off') {
        moduleState.disabledThreads.add(threadID);
        saveState();
        return api.sendMessage("❌ Auto-download disabled for this thread", threadID, messageID);
      }
    }

    // Admin-only toggle
    if (command === 'admin' && subCommand && isAdmin(senderID)) {
      moduleState.adminOnly = subCommand === 'on';
      saveState();
      return api.sendMessage(
        `✅ Admin-only mode ${moduleState.adminOnly ? 'ENABLED' : 'DISABLED'}`,
        threadID,
        messageID
      );
    }

    // Status command
    if (command === 'status') {
      const threadStatus = moduleState.disabledThreads.has(threadID) ? '❌ Disabled' : '✅ Enabled';
      return api.sendMessage(
        `Auto-download Status:
• Global: ${moduleState.isEnabled ? '✅ Enabled' : '❌ Disabled'}
• This Thread: ${threadStatus}
• Admin Only: ${moduleState.adminOnly ? '✅ Yes' : '❌ No'}`,
        threadID,
        messageID
      );
    }
  }

  // Check if module is active for this context
  const isThreadDisabled = moduleState.disabledThreads.has(threadID);
  if (!moduleState.isEnabled || isThreadDisabled) return;
  if (moduleState.adminOnly && !isAdmin(senderID)) return;

  // Process video URL
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
