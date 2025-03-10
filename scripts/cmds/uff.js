module.exports = {
  config: {
    name: "girlsvideo",
    aliases: ["girl"],
    version: "2.0",
    author: "𝗦𝗵𝗔𝗻",
    countDown: 0,
    role: 0,
    shortDescription: "",
    longDescription: "send you a hot girl video",
    category: "18+",
    guide: "{p}{n}",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "কিরে লুচ্চা 🤨 দারা দিতেছি 😜",
    });

    const link = [
"https://drive.google.com/uc?export=download&id=16HuQeuPLsfMcXLITNOJSBVJewHmXk8Ru",
"https://drive.google.com/uc?export=download&id=16BJpSk2zk7Uy9DxLxbwFkEW9uDXsYzlB",
"https://drive.google.com/uc?export=download&id=17by8dS0pQY4d1tIJIsoaeAuRvATiGywY",
"https://drive.google.com/uc?export=download&id=16U0pk5Z1xSK1noxppaBSVoWABeLtu4RG",
"https://drive.google.com/uc?export=download&id=15mNY62pGLPq7W_Uly5IBi0dd9YHzWyWc",
"https://drive.google.com/uc?export=download&id=15PMxc-gznm4Ona3fZLPTs7Yj3kOfx0Wf",
"https://drive.google.com/uc?export=download&id=16I-YJcYmNOBHWath6Y86F44d7e_ofe7J",
"https://drive.google.com/uc?export=download&id=17Udy1YF9M0f6kVkTY_I2s_Lgy3iXheuj",
"https://drive.google.com/uc?export=download&id=16sM1E35-ua6qAKfSnnGlIAQQmb4bqgRD",
"https://drive.google.com/uc?export=download&id=15qhYDHsVznBZVyBniyNlECYovVnLgiBV",
"https://drive.google.com/uc?export=download&id=16Eg73csaToVbQ0lz_hDxk8L6sKjSLvgd",
"https://drive.google.com/uc?export=download&id=17zX7xULbhcYDtfjZwcSfb8esrAH8ePwY",
"https://drive.google.com/uc?export=download&id=17bx6rdpZo4SEiSeiMpI_asDXbazTBdTg"
   ];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];

    this.sentVideos.push(randomVideo);

    if (senderID !== null) {
      message.reply({
        body: 'এই নে বোকাচুলা দেখ 🥵💦',
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 50000);

      setTimeout(() => {
        api.unsendMessage(link.messageID);
      }, 100000);
    }
  },
};
