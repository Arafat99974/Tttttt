module.exports = {
  config: {
    name: "choose",
    aliases: [""],
    version: "1.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 0,
    role: 0,
    shortDescription: "Choose one option from a list",
    longDescription: "Choose one option from a list",
    category: "𝗙𝗨𝗡",
    guide: {
      en: "{pn} option1, option2, option3 - Choose one option",
    },
  },

  onStart: function ({ args, api, event }) {
    if (args.length < 1) {
      api.sendMessage("Usage: !choose option1, option2, option3", event.threadID);
      return;
    }
    const options = args.join(" ").includes("|") ? args.join(" ").split("|") : args.join(" ").split(",");
    const fancyOptions = options.map((option) => toFancyText(option.trim()));

    const randomIndex = Math.floor(Math.random() * fancyOptions.length);
    const chosenOption = fancyOptions[randomIndex];

    api.sendMessage(`${chosenOption} is the best choice!`, event.threadID, event.messageID);
  },
};

function toFancyText(text) {
  const fancyMap = {
    a: '𝗔',
    b: '𝗕',
    c: '𝗖',
    d: '𝗗',
    e: '𝗘',
    f: '𝗙',
    g: '𝗚',
    h: '𝗛',
    i: '𝗜',
    j: '𝗝',
    k: '𝗞',
    l: '𝗟',
    m: '𝗠',
    n: '𝗡',
    o: '𝗢',
    p: '𝗣',
    q: '𝗤',
    r: '𝗥',
    s: '𝗦',
    t: '𝗧',
    u: '𝗨',
    v: '𝗩',
    w: '𝗪',
    x: '𝗫',
    y: '𝗬',
    z: '𝗭',
  };

  return text
    .toLowerCase()
    .split('')
    .map((char) => (fancyMap[char] ? fancyMap[char] : char))
    .join('');
}
