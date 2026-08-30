const axios = require("axios");
const fs = require("fs");

const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const autoTagThreads = new Map();

module.exports = {
	config: {
		name: "autotag",
		version: "8.0",
		author: AUTHOR,
		countDown: 5,
		role: 1,
		shortDescription: {
			en: "Auto everyone tag system"
		},
		longDescription: {
			en: "Auto tag all members every 30 minutes"
		},
		category: "box chat",
		guide: {
			en: "{pn} on/off"
		}
	},

	onStart: async function ({ api, event, args, message }) {

		// 🔒 AUTHOR LOCK
		const content = fs.readFileSync(__filename, "utf8");

		if (
			!content.includes('const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"')
		) {
			console.log("🚫 AUTHOR LOCK ACTIVATED");
			process.exit(1);
		}

		const threadID = event.threadID;

		// ❌ OFF SYSTEM
		if (args[0] === "off") {

			if (autoTagThreads.has(threadID)) {
				clearInterval(autoTagThreads.get(threadID));
				autoTagThreads.delete(threadID);

				return message.reply(`
╭━〔 ❌ 𝗔𝗨𝗧𝗢 𝗧𝗔𝗚 𝗢𝗙𝗙 〕━╮
┃ 📴 অটো ট্যাগ সিস্টেম বন্ধ করা হয়েছে
╰━━━━━━━━━━━━━━━━╯
`);
			}

			return message.reply(`
╭━〔 ⚠️ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗢𝗙𝗙 〕━╮
┃ ❌ অটো ট্যাগ আগে থেকেই বন্ধ আছে
╰━━━━━━━━━━━━━━━━╯
`);
		}

		// ⚠️ ALREADY ON
		if (autoTagThreads.has(threadID)) {
			return message.reply(`
╭━〔 ⚠️ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗢𝗡 〕━╮
┃ ✅ অটো ট্যাগ আগে থেকেই চালু আছে
╰━━━━━━━━━━━━━━━━╯
`);
		}

		// ✅ MAIN AUTO SYSTEM
		const interval = setInterval(async () => {

			try {

				const threadInfo = await api.getThreadInfo(threadID);
				const participantIDs = threadInfo.participantIDs;

				const now = new Date();

				// 🇧🇩 BD TIME
				const time = now.toLocaleTimeString("en-US", {
					timeZone: "Asia/Dhaka",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: true
				});

				const date = now.toLocaleDateString("en-GB", {
					timeZone: "Asia/Dhaka",
					day: "2-digit",
					month: "long",
					year: "numeric"
				});

				// 🌦️ WEATHER
				let weather = "Unavailable";

				try {
					const res = await axios.get("https://wttr.in/Dhaka?format=3");
					weather = res.data;
				} catch (e) {}

				// 🎭 RANDOM EMOJI
				const emojis = ["🔥","⚡","👑","💀","😈","🚨","💣"];
				const emoji = emojis[Math.floor(Math.random() * emojis.length)];

				let body = `
╔═══════🚨═══════╗
      ${emoji} সবাই অনলাইনে আসো ${emoji}
╚═══════🚨═══════╝

👥 @everyone
» 👥 @everyone

» 📢 গ্রুপের সকল সদস্যদের দৃষ্টি আকর্ষণ করা যাচ্ছে!

» ⚠️ সবাই দ্রুত গ্রুপে এক্টিভ হও
» 🔥 বস অনলাইনে আছে
» 😈 কেউ সিন মেরে পালাইবা না

━━━━━━━━━━━━━━━━━━

» ⏰ সময় ➤ ${time}
» 📅 তারিখ ➤ ${date}
» 🌦️ আবহাওয়া ➤ ${weather}

━━━━━━━━━━━━━━━━━━

»  OWNER INFO 

» 👑 NAME ➤ SIFAT AHMED
» 🏡 LOCATION ➤ BOGURA, BANGLADESH
» 🎂 AGE ➤ 19+
» 📚 CLASS ➤ 10
» 💔 STATUS ➤ SINGLE
» ⚡ PROFESSION ➤ STUDENT

╚════════════════╝

» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕
`;

				const mentions = [];
				const index = body.indexOf("@everyone");

				for (const uid of participantIDs) {
					mentions.push({
						tag: "@everyone",
						id: uid,
						fromIndex: index
					});
				}

				// 📤 SEND MESSAGE
				api.sendMessage(
					{
						body,
						mentions
					},
					threadID,
					(err, info) => {

						if (!err) {

							// 🗑️ AUTO DELETE AFTER 5 MINUTES
							setTimeout(() => {
								api.unsendMessage(info.messageID);
							}, 5 * 60 * 1000);

						}
					}
				);

			} catch (err) {
				console.log(err);
			}

		}, 30 * 60 * 1000); // ⏰ EVERY 30 MINUTES

		autoTagThreads.set(threadID, interval);

		return message.reply(`
╭━〔 ✅ 𝗔𝗨𝗧𝗢 𝗧𝗔𝗚 𝗢𝗡 〕━╮
┃ 🚀 অটো ট্যাগ সিস্টেম চালু হয়েছে
┃ ⏰ প্রতি ৩০ মিনিট পর মেসেজ যাবে
┃ 🗑️ ৫ মিনিট পর অটো ডিলিট হবে
╰━━━━━━━━━━━━━━━━━╯
`);
	}
};
					
