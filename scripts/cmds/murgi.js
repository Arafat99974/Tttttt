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
    var arraytag = [];
        arraytag.push({id: mention, tag: name});
    var ArYan = function (ArYan) { api.sendMessage(ArYan, event.threadID); }
ArYan("hello bro TAMIM er Chuda kha 🥱");
setTimeout(() => {ArYan({body:"খানকির বাচ্চা তোর মারে চুদি 🫦।" + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {ArYan({body: "খানকির বাচ্চা তোর কচি বোন রে চুদি 💋.." + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {ArYan({body: "মাদারচোদ তোর আম্মুর পম পম খানকির পো 🐰" + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {ArYan({body: "খানকির বাচ্চা তোর মার  ভুদায় কামর দিমু 🖕!" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {ArYan({body: "খানকি মাগির বাচ্চা কথা ক কম কম তোর আম্মু রে চুদে বানামু আইটেম বোম " + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {ArYan({body: "depression থেকেও তোর মাইরে চু*** দি 🫵🥵 " + " " + name, mentions: arraytag})}, 15000);
setTimeout(() => {ArYan({body: "তোর আম্মু রে আচার এর লোভ দেখিয়ে চুদি নটির বাচ্চা 🤬" + " " + name, mentions: arraytag})}, 17000);




	}
