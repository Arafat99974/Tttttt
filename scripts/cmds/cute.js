module.exports = {
	config: {
		name: "cute",
		aliases: ["cute",],
		version: "1.0",
		author: "ShAn",
		countDown: 5,
		role: 0,
		shortDescription: "send you a cute photos",
		longDescription: "Sand you a cute baby,animi,etc photos",
		category: "𝗜𝗠𝗔𝗚𝗘",
		guide: "{pn}"
	},

	onStart: async function ({ api, event, message }) {
	api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
	 var link = [
"https://i.ibb.co/ksnQjKQf/image.jpg",
"https://i.ibb.co/ksnQjKQf/image.jpg",
"https://i.ibb.co/TCwP5f6/image.jpg",
"https://i.ibb.co/BHQyjWHg/image.jpg",
"https://i.ibb.co/FLBvqk0p/image.jpg",
"https://i.ibb.co/5h55tCkn/image.jpg",
"https://i.ibb.co/5gd7Rr4L/image.jpg",
"https://i.ibb.co/hRpgS208/image.jpg",
"https://i.ibb.co/1YhR81WG/image.jpg",
"https://i.ibb.co/7JM7DKGB/image.jpg",
"https://i.ibb.co/QvdsZjnD/image.jpg",
"https://i.ibb.co/wZvs2v6V/image.jpg",
"https://i.ibb.co/9m97BbkZ/image.jpg",
"https://i.ibb.co/SXR3X8j1/image.jpg",
	 ];

let img = link[Math.floor(Math.random()*link.length)]
api.setMessageReaction("✅", event.messageID, (err) => {}, true);
message.send({
	body: '「 EI NAW TMR DPZ😎  」',attachment: await global.utils.getStreamFromURL(img)
})
}
		 }
