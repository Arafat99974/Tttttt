module.exports.config = {
    name: "murgi",
    version: "5.1.0",
    role: 2,
    author: "𝗦𝗵𝗔𝗻",
    description: "Your friends invet pleace",
    category: "𝗙𝗨𝗡",
    guide: "{p} @mention",
    coolDown: 10
}
module.exports.onStart = async function({ api, args, Users, event}) {
    var mention = Object.keys(event.mentions)[0];
    if(!mention) return api.sendMessage("Boss Khanki has a mansion in Pullar.", event.threadID);
 let name =  event.mentions[mention];
    var shantag = [];
        shantag.push({id: mention, tag: name});
    var ShAn = function (ShAn) { api.sendMessage(ShAn, event.threadID); }
ShAn("hello bro ShAn er Chuda kha 🥱");
setTimeout(() => {ShAn({body:"খানকির বাচ্চা তোর মারে চুদি 🫦।" + " " + name, mentions: shantag})}, 3000);
setTimeout(() => {ShAn({body: "খানকির বাচ্চা তোর কচি বোন রে চুদি 💋.." + " " + name, mentions: shantag})}, 5000);
setTimeout(() => {ShAn({body: "মাদারচোদ তোর আম্মুর পম পম খানকির পো 🐰" + " " + name, mentions: shantag})}, 7000);
setTimeout(() => {ShAn({body: "খানকির বাচ্চা তোর মার  ভুদায় কামর দিমু 🖕!" + " " + name, mentions: shantag})}, 9000);
setTimeout(() => {ShAn({body: "খানকি মাগির বাচ্চা কথা ক কম কম তোর আম্মু রে চুদে বানামু আইটেম বোম " + " " + name, mentions: shantag})}, 12000);
setTimeout(() => {ShAn({body: "depression থেকেও তোর মাইরে চু*** দি 🫵🥵 " + " " + name, mentions: shantag})}, 15000);
setTimeout(() => {ShAn({body: "তোর আম্মু রে আচার এর লোভ দেখিয়ে চুদি নটির বাচ্চা 🤬" + " " + name, mentions: shantag})}, 17000);
setTimeout(() => {api.unsendMessage(setTimeout.threadID);},50000);



	}
