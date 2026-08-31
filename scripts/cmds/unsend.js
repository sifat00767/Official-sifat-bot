module.exports = {
	config: {
		name: "unsend",
		aliases: ["u", "uns", "r"],
		version: "1.6",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 0,
		description: {
			en: "Unsend bot message"
		},
		category: "box chat"
	},

	onStart: async function ({ message, event, api }) {
		if (!event.messageReply || event.messageReply.senderID !== api.getCurrentUserID()) {
			return message.reply(`⚠️ 𝗠𝗜𝗦𝗦𝗜𝗡𝗚 𝗥𝗘𝗣𝗟𝗬\n───────────────\n» ❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗯𝗼𝘁 𝗺𝗲𝘀𝘀𝗮𝗴𝗲.\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡`);
		}

		message.unsend(event.messageReply.messageID);
	},

	// NO-PREFIX HANDLER
	onChat: async function ({ event, message, api }) {
		if (!event.body || !event.messageReply) return;

		const text = event.body.toLowerCase().trim();

		// বাংলা ও ইংরেজি মিক্সড কি-ওয়ার্ডস লিস্ট
		const silent = [
			"u", "uns", "r", "unsend", "s", "sifat",
			"ডিলিট করো", "আনসেন্ট", "ডিলিট কর বট"
		];

		if (
			silent.includes(text) &&
			event.messageReply.senderID === api.getCurrentUserID()
		) {
			message.unsend(event.messageReply.messageID);
		}
	}
};
