const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports = {
config: {
  name: "owner",
  aurthor:"𝗦𝗵𝗔𝗻",// Don't Change I't
   role: 0,
  shortDescription: " ",
  longDescription: "",
  category: "𝗜𝗡𝗙𝗢",
  guide: "{pn}"
},

  onStart: async function ({ api, event }) {
  try {
    const ShanInfo = {
      name: '(╹◡╹)𝑬𝒘𝑹彡S𝓱ₐ𝚗(◍•ᴗ•◍)Ψ',
      nick: '𝗦𝗵𝗔𝗻',
      gender: '𝑴𝒂𝑳𝒆',
      birthday: '10-𝟎𝟕-𝟐𝟎𝟎5',
      age:'19',
      Status: 'আমি বললুম না আমার শরম করে😝🤭',
      hobby: '𝑺𝒍𝒆𝒆𝑷𝒊𝒏𝑮',
      religion: '𝙄𝒔𝒍𝑨𝒎',
      height: '5"3',
      Fb: 'https://www.facebook.com/sirana252',
      messenger: 'https://m.me/sirana252',
      authorNumber: 'এইটা পার্সোনাল',
      insta: 'https://www.instagram.com/sirana252',
      tg: 'https://t.me/si_rana252',
      capcut: 'কোনো আইড়ি নাই , Alight motion ব্যবহার করি।',
      tiktok: 'আমি প্রতিবন্ধী না 🙂',
      youtube: 'নিজের কোনো চ্যানেল নাই ☺️, এমনিতেই কারো YouTube premium লাগলে ইনবক্স করিও?',
    };
    const now = moment().tz('Asia/Jakarta');
		const date = now.format('MMMM Do YYYY');
		const time = now.format('h:mm:ss A');
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / (60 * 60)) % 24);
		const days = Math.floor(uptime / (60 * 60 * 24));
		const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

    const bold = 'https://i.imgur.com/DDO686J.mp4'; // Replace with your Google Drive videoid link https://drive.google.com/uc?export=download&id=here put your video id
    const tmpFolderPath = path.join(__dirname, 'tmp');

    if (!fs.existsSync(tmpFolderPath)) {
      fs.mkdirSync(tmpFolderPath);
    }

    const videoResponse = await axios.get(bold, { responseType: 'arraybuffer' });
    const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

    const response = `💫《 ⩸__𝐁𝐨𝐭 𝐀𝐧𝐝 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__⩸ 》💫
\🤖彡𝐵𝑜𝑡 𝑁𝑎𝑚𝑒 : ⩸__${global.GoatBot.config.nickNameBot}__⩸
\👾彡𝐵𝑜𝑡 𝑆𝑦𝑠𝑡𝑒𝑚 𝑃𝑟𝑒𝑓𝑖𝑥 : ${global.GoatBot.config.prefix}
\💙彡𝑂𝑤𝑛𝑒𝑟 𝑁𝑎𝑚𝑒 : ${ShanInfo.name}
\🙆🏻‍♂️彡𝐺𝑒𝑛𝑑𝑒𝑟 : ${ShanInfo.gender}
\😶彡𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦 : ${ShanInfo.birthday}
\📝彡𝐴𝑔𝑒  : ${ShanInfo.age}
\💕彡𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑆ℎ𝑖𝑝 : ${ShanInfo.Status}
\🐸彡𝐻𝑜𝑏𝑏𝑦 : ${ShanInfo.hobby}
\🕋彡𝑅𝑒𝑙𝑖𝑔𝑖𝑜𝑛 : ${ShanInfo.religion}
\🙎🏻‍♂️彡𝐻𝑖𝑔ℎ𝑡 : ${ShanInfo.hight}
\🌍彡𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐿𝑖𝑛𝑘 : ${ShanInfo.Fb}
\🌐彡𝑊𝑝 : ${ShanInfo.authorNumber}
\🔖彡𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 : ${ShanInfo.insta}
\🏷彡️𝑇𝑒𝑙𝑒𝑔𝑟𝑎𝑚 : ${ShanInfo.tg}
\☠彡️𝐶𝑎𝑝𝐶𝑢𝑡 : ${ShanInfo.capcut}
\🤡彡𝑇𝑖𝑘𝑇𝑜𝑘 : ${ShanInfo.tiktok}
\🤐彡𝑌𝑜𝑢𝑇𝑢𝑏𝑒 : ${ShanInfo.youtube}
\🗓彡𝐷𝑎𝑡𝑒 : ${date}
\⏰彡𝑁𝑜𝑤 𝑇𝑖𝑚𝑒 : ${time}
\🔰彡𝐴𝑛𝑦 𝐻𝑒𝑙𝑝 𝐶𝑜𝑛𝑡𝑎𝑐𝑡 :⩸__${ShanInfo.messenger}__⩸
\📛彡𝐵𝑜𝑡 𝐼𝑠 𝑅𝑢𝑛𝑛𝑖𝑛𝑔 𝐹𝑜𝑟 : ${uptimeString}
\===============`;

    await api.sendMessage({
      body: response,
      attachment: fs.createReadStream(videoPath)
    }, event.threadID, event.messageID);

    fs.unlinkSync(videoPath);
    
  api.setMessageReaction('😍', event.messageID, (err) => {}, true);
  } catch (error) {
    console.error('Error in ownerinfo command:', error);
    return api.sendMessage('An error occurred while processing the command.', event.threadID);
  }
},
};
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
