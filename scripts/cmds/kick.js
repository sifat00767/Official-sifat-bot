const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "kick",
		version: "2.3",
		author: "FARHAN-KHAN",
		countDown: 5,
		role: 1,
		description: {
			en: "গ্রুপ থেকে মেম্বার বের করে দেওয়ার কমান্ড।"
		},
		category: "গ্রুপ ম্যানেজমেন্ট",
		guide: {
			en: "ব্যবহারের নিয়ম:\n১. যাকে বের করবেন তাকে মেনশন দিন: {pn} @নাম [কারণ]\n২. অথবা তার মেসেজে রিপ্লাই দিয়ে লিখুন: {pn} [কারণ]"
		}
	},

	langs: {
		en: {
			needAdmin: "বোটকে আগে গ্রুপের এডমিন বানান, নাহলে আমি কাউকে বের করতে পারবো না! ⚠️",
			noTarget: "যাকে বের করবেন তাকে মেনশন দিন অথবা তার মেসেজে রিপ্লাই দিন। 🧐",
			adminKick: "🛡️সিয়াম বস📂, 💁গ্রুপ এডমিন 🤔তোমার 🥵ধ*ন চু*সা 🦵কামলা হিসাবে রাইখা দাও😂! ❌",
			error: "🫶সিয়াম বস🛡️ বের করতে समस्या হচ্ছে😔। হয়তো আমার পারমিশন নেই🤧 বা ইউজারটি গ্রুপে নেই। ⚠️"
		}
	},

	onStart: async function ({ message, event, api, args, usersData, getLang }) {
		const { threadID, messageReply, mentions, senderID } = event;

		try {
			const threadInfo = await api.getThreadInfo(threadID);
			const adminIDs = threadInfo.adminIDs.map(item => item.id);
			const botID = api.getCurrentUserID();

			if (!adminIDs.includes(botID)) {
				return message.reply(getLang("needAdmin"));
			}

			let targetID;
			let reasonIndex = 0;

			if (event.type === "message_reply") {
				targetID = messageReply.senderID;
				reasonIndex = 0;
			} else if (Object.keys(mentions).length > 0) {
				targetID = Object.keys(mentions)[0];
				reasonIndex = 1;
			} else {
				return message.reply(getLang("noTarget"));
			}

			if (adminIDs.includes(targetID)) {
				return message.reply(getLang("adminKick"));
			}

			const reason = args.slice(reasonIndex).join(" ") || "𝑵𝒐 𝑹𝒆𝒂𝒔𝒐𝒏 𝑾𝒂𝒔 𝑮𝒊𝒗𝒆𝒏";
			const targetName = await usersData.getName(targetID);
			const actionByName = await usersData.getName(senderID);

			const filePath = path.join(__dirname, "kick_log.txt");
			const timeNow = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

			const statusText = "𝑹𝒆𝒎𝒐𝒗𝒊𝒏𝒈 𝑭𝒓𝒐𝒎 2 𝑺𝒆𝒄𝒐𝒏𝒅...";

			// হেডারে ১টি \n এবং বাকিগুলোতে ২টি \n ব্যবহার করা হয়েছে
			const responseMsg = 
				`━━━━━━━♡❤️♡━━━━━━━\n` +
				`🛑 ⏤͟͟͞͞𝑷𝒂𝒓𝒎𝒂𝒏𝒆𝒏𝒕 𝑲𝒊𝒄𝒌 🛑\n` +
				`━━━━━━━♡❤️♡━━━━━━━\n\n` +
				`👤 ⏤͟͟͞͞𝑵𝒂𝒎𝒆 : ${targetName}\n\n` +
				`🆔 ⏤͟͟͞͞𝑼𝒊𝒅 : ${targetID}\n\n` +
				`📝 ⏤͟͟͞͞𝑹𝒆𝒂𝒔𝒐𝒏 : 𝑵𝒐 𝑹𝒆𝒂𝒔𝒐𝒏 𝑾𝒂𝒔 𝒈𝒊𝒗𝒆𝒏\n\n` +
				`👑 ⏤͟͟͞͞𝑨𝒄𝒕𝒊𝒐𝒏 𝒃𝒚 : 𝑩𝒐𝒕 𝑨𝒅𝒎𝒊𝒏\n\n` +
				`⚡ ⏤͟͟͞͞𝑺𝒕𝒂𝒕𝒖𝒔 : 𝑹𝒆𝒎𝒐𝒗𝒊𝒏𝒈 𝑭𝒓𝒐𝒎 𝒈𝒓𝒐𝒖𝒑 𝒊𝒏 2 𝒔𝒆𝒄𝒐𝒏𝒅...\n` +
				`━━━━━━━♡❤️♡━━━━━━━`;

			// আগে চ্যাটে মেসেজ পাঠাবে
			await message.reply(responseMsg);

			// তারপর ইউজারকে গ্রুপ থেকে কিক করে ফাইল লগ সেভ করবে
			api.removeUserFromGroup(targetID, threadID, async (err) => {
				let logStatus = "Success";

				if (err) {
					logStatus = `Failed (${err.errorDescription || err.error || "No Permission"})`;
				}

				const logEntry = `[${timeNow}] Name: ${targetName} | UID: ${targetID} | Reason: ${reason} | KickBy: ${actionByName} | Status: ${logStatus}\n`;

				try {
					fs.appendFileSync(filePath, logEntry, "utf-8");
				} catch (fileErr) {
					console.error("Error writing to kick_log.txt:", fileErr);
				}
			});

		} catch (err) {
			console.error(err);
			return message.reply("একটি অজানা সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
		}
	}
};
