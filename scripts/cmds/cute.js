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
"https://i.postimg.cc/pdC1G6qs/FB-IMG-1740309148426.jpg",
"https://i.postimg.cc/52wrv0vd/FB-IMG-1740370485767.jpg",
"https://i.postimg.cc/3Rbf7DMp/FB-IMG-1740370488521.jpg",
"https://i.postimg.cc/TY5FdQ3P/FB-IMG-1740370491049.jpg",
"https://i.postimg.cc/VkyTdMJW/FB-IMG-1740370493815.jpg",
"https://i.postimg.cc/KjwW73JF/FB-IMG-1740370706775.jpg",
"https://i.postimg.cc/Qd52bm2z/FB-IMG-1740370830108.jpg",
"https://i.postimg.cc/vmspS9MZ/FB-IMG-1740371019274.jpg",
"https://i.postimg.cc/C1KrWs2S/FB-IMG-1740374231324.jpg",
"https://i.postimg.cc/Y2DBqhNd/FB-IMG-1740384462728.jpg",
"https://i.postimg.cc/kGGrvmCN/FB-IMG-1740384480055.jpg",
"https://i.postimg.cc/nryd9bhh/FB-IMG-1740384639790.jpg",
"https://i.postimg.cc/2j1rWQSs/FB-IMG-1740384819076.jpg",
"https://i.postimg.cc/9fCnBht4/FB-IMG-1740384856654.jpg",
"https://i.postimg.cc/2jKgNgmJ/FB-IMG-1740384864313.jpg",
"https://i.postimg.cc/g0Hf9Jkq/FB-IMG-1740384971148.jpg",
"https://i.postimg.cc/VvdTbW9D/FB-IMG-1740384977351.jpg",
"https://i.postimg.cc/DyWkWnBn/FB-IMG-1740384995861.jpg",
"https://i.postimg.cc/CLWykXQD/FB-IMG-1740385000930.jpg",
"https://i.postimg.cc/4ySD8S4D/FB-IMG-1740385080906.jpg",
"https://i.postimg.cc/k4jz4pS2/FB-IMG-1740385242911.jpg",
"https://i.postimg.cc/Tw2BT6K8/FB-IMG-1740386158959.jpg",
"https://i.postimg.cc/6q2jQ5wP/FB-IMG-1740622101013.jpg",
"https://i.postimg.cc/0y177M2R/FB-IMG-1738436076057.jpg",
"https://i.postimg.cc/YqW14f7z/FB-IMG-1738436663959.jpg",
"https://i.postimg.cc/76Z3bFP5/FB-IMG-1738437281092.jpg",
"https://i.postimg.cc/J09Z6tNX/FB-IMG-1738437309647.jpg",
"https://i.postimg.cc/L8kLD9nq/FB-IMG-1738561416297.jpg",
"https://i.postimg.cc/C5tH3cgz/FB-IMG-1738561421130.jpg",
"https://i.postimg.cc/jqkXnS7t/FB-IMG-1738561427318.jpg",
"https://i.postimg.cc/y80XGhr8/FB-IMG-1738561432249.jpg",
"https://i.postimg.cc/KcVPvp6Y/FB-IMG-1738608931750.jpg",
"https://i.postimg.cc/Hnj9vfFq/FB-IMG-1738608936430.jpg",
"https://i.postimg.cc/50sm3xK5/FB-IMG-1738608940048.jpg",
"https://i.postimg.cc/RVkLGpdY/FB-IMG-1738608944591.jpg",
"https://i.postimg.cc/bNDRxfxb/FB-IMG-1738608948952.jpg",
"https://i.postimg.cc/ZqcPbbmk/FB-IMG-1738608953531.jpg",
"https://i.postimg.cc/0QXpSVrc/FB-IMG-1738608958212.jpg",
"https://i.postimg.cc/LsRBFqrB/FB-IMG-1738608962809.jpg",
"https://i.postimg.cc/Zn96x6dZ/FB-IMG-1738608967961.jpg",
"https://i.postimg.cc/nL542D5H/FB-IMG-1738862084167.jpg",
"https://i.postimg.cc/qMXGrgtL/FB-IMG-1738862088864.jpg",
"https://i.postimg.cc/wTVDPPP4/FB-IMG-1738862454309.jpg",
"https://i.postimg.cc/KzMnHYSt/FB-IMG-1738862521937.jpg",
"https://i.postimg.cc/6Q7R8QQF/FB-IMG-1738862710176.jpg",
"https://i.postimg.cc/4dD1f9b8/FB-IMG-1738862852758.jpg",
"https://i.postimg.cc/LXYTFTfY/FB-IMG-1738862905255.jpg",
"https://i.postimg.cc/J03jRdhn/FB-IMG-1738862929473.jpg",
"https://i.postimg.cc/wBbVrPtY/FB-IMG-1738863131269.jpg",
"https://i.postimg.cc/5y8S62sf/FB-IMG-1738902128104.jpg"
	 ]

let img = link[Math.floor(Math.random()*link.length)]
api.setMessageReaction("✅", event.messageID, (err) => {}, true);
message.send({
	body: '「 EI NAW TMR DPZ😎  」',attachment: await global.utils.getStreamFromURL(img)
})
}
		 }
