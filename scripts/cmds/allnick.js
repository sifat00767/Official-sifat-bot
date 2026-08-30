module.exports = {
  config: {
    name: "allnick",
    aliases: ["an"],
    version: "3.0.0",
    author: "亗 SIYAM HASAN 亗",
    countDown: 10,
    role: 1,
    shortDescription: {
      en: "Change/reset nickname of all members safely"
    },
    category: "owner",
    guide: {
      en: "{pn} <nickname | cancel>"
    },
    envConfig: {
      delayPerBatch: 1500,
      batchSize: 5,
      retryLimit: 1
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID;
    const input = args.join(" ").trim();

    if (!input) {
      return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ⚠️ নিকনেম দাও অথবা cancel লেখো 
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
      );
    }

    try {
      const threadInfo = await api.getThreadInfo(threadID);

      if (!threadInfo.isGroup) {
        return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ❌ এই কমান্ড শুধু গ্রুপে কাজ করে 
» 😇 গ্রুপের বাহিরে নাহ !! 
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
        );
      }

      const botID = api.getCurrentUserID();
      const isAdmin = threadInfo.adminIDs.some(item => item.id == botID);

      if (!isAdmin) {
        return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ⛔ বট এডমিন না 😾
» ✨ আগে বটকে এডমিন বানাও
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
        );
      }

      const members = threadInfo.participantIDs || [];
      const totalMembers = members.length;

      await message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🚀 মোট ${totalMembers} জন মেম্বারের নিকনেম চেঞ্জ শুরু হচ্ছে... 💫
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
      );

      const { delayPerBatch, batchSize } = module.exports.config.envConfig;
      let done = 0;
      let failedCount = 0;
      let lastProgressPercent = 0;

      for (let i = 0; i < totalMembers; i += batchSize) {
        const batch = members.slice(i, i + batchSize);

        await Promise.all(batch.map(async (userID) => {
          try {
            if (input.toLowerCase() === "cancel") {
              await api.changeNickname("", threadID, userID);
            } else {
              await api.changeNickname(input, threadID, userID);
            }
            done++;
          } catch (err) {
            failedCount++;
          }
        }));

        const currentPercent = Math.floor((done / totalMembers) * 100);
        if (currentPercent >= lastProgressPercent + 20 || currentPercent === 100) {
          lastProgressPercent = currentPercent;
          const progMsg = `_⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡  👑\n\n📊 কাজ চলছে... ${currentPercent}% সম্পন্ন ✨\n\n👑 _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;
          
          try {
            await api.sendMessage(progMsg, threadID);
          } catch (e) {
            console.error(e.message);
          }
        }

        await new Promise(resolve => setTimeout(resolve, delayPerBatch));
      }

      if (failedCount === 0) {
        if (input.toLowerCase() === "cancel") {
          return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🔄 সব মেম্বারের নিকনেম রিমুভ করা হয়েছে 💫
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
          );
        } else {
          return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ✅ সব মেম্বারের নিকনেম সফলভাবে চেঞ্জ হয়েছে ✨
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
          );
        }
      } else {
        return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ✅ কাজ শেষ! সফল: ${done} জন।
» ⚠️ ফেসবুক লিমিটের কারণে ${failedCount} জনের চেঞ্জ করা যায়নি 😿 ADMIN 😔
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
        );
      }

    } catch (err) {
      console.error(err);
      return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ❌ সিস্টেম এরর হয়েছে! গ্রুপ ডাটা  লোড ফেইল 😿
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
      );
    }
  }
};
