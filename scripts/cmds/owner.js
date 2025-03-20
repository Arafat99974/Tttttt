const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
config: {
  name: "owner",
  aurthor:"𝗦𝗵𝗔𝗻",// Convert By Goatbot Tokodori 
   role: 0,
  shortDescription: " ",
  longDescription: "",
  category: "𝗜𝗡𝗙𝗢",
  guide: "{pn}"
},

  onStart: async function ({ api, event }) {
  try {
    const ownerInfo = {
      name: '𝑬𝒘𝑹 𝑺𝒉𝑨𝒏',
      gender: '𝑴𝒂𝑳𝒆',
      Birthday: '10-𝟎𝟕-𝟐𝟎𝟎5',
      religion: '𝙄𝒔𝒍𝑨𝒎',
      hobby: '𝑺𝒍𝒆𝒆𝑷𝒊𝒏𝑮',
      Fb: 'https://www.facebook.com/sirana252',
      Relationship: '𝑺𝒊𝒏𝑮𝒆𝒍',
      height: '5"3',
      nick: '𝗦𝗵𝗔𝗻'
    };

    const bold = 'https://i.imgur.com/DDO686J.mp4'; // Replace with your Google Drive videoid link https://drive.google.com/uc?export=download&id=here put your video id
    const tmpFolderPath = path.join(__dirname, 'tmp');

    if (!fs.existsSync(tmpFolderPath)) {
      fs.mkdirSync(tmpFolderPath);
    }

    const videoResponse = await axios.get(bold, { responseType: 'arraybuffer' });
    const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

    const response = `
◈𝖮𝖶𝖭𝖤𝖱 𝖨𝖭𝖥𝖮𝖱𝖬𝖠𝖳𝖨𝖮𝖭:🧾
~Name: ${ownerInfo.name}
~Gender: ${ownerInfo.gender}
~Birthday: ${ownerInfo.Birthday}
~Religion: ${ownerInfo.religion}
~Hobby: ${ownerInfo.hobby}
~Fb: ${ownerInfo.Fb}
~Height: ${ownerInfo.Height}
~Nick: ${ownerInfo.nick}
`;


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
