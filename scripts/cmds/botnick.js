const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const fs = require("fs");

module.exports = {
  config: {
    name: "botnick",
    aliases: ["sn"],
    version: "2.0",
    author: LOCKED_AUTHOR,
    countDown: 5,
    role: 2,

    shortDescription: {
      en: "Premium nickname changer"
    },

    longDescription: {
      en: "Change bot nickname in all groups with premium design"
    },

    category: "owner",

    guide: {
      en: "{pn} <new nickname>"
    },

    envConfig: {
      delayPerGroup: 250
    }
  },

  langs: {
    en: {

      missingNickname: `
╔💎𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘 𝗘𝗥𝗥𝗢𝗥💎╗
┃ ⚠️ নতুন নিকনেম লিখুন
┃ 📝 উদাহরণ ➤ ,botnick SIFAT BOT
╚═════════════════╝
`,

      changingNickname: `
╔🚀𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘 𝗨𝗣𝗗𝗔𝗧𝗘🚀╗
┃ 🔄 বটের নিকনেম পরিবর্তন শুরু হয়েছে
┃ 👥 মোট %2 টি গ্রুপে কাজ চলছে
┃ ⚡ নতুন নাম ➤ %1
╚═════════════════╝
`,

      successMessage: `
╔👑𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘 𝗦𝗨𝗖𝗖𝗘𝗦𝗦👑╗
┃ ✅ সফলভাবে সব গ্রুপে
┃ 🤖 বটের নিকনেম পরিবর্তন হয়েছে
┃ 💎 নতুন নাম ➤ %1
╚═════════════════╝
`,

      partialSuccessMessage: `
╔⚠️𝗣𝗔𝗥𝗧𝗜𝗔𝗟 𝗦𝗨𝗖𝗖𝗘𝗦𝗦⚠️╗
┃ ✅ কিছু গ্রুপে সফল হয়েছে
┃ ❌ কিছু গ্রুপে ব্যর্থ হয়েছে
┃ 🛡️ কারণ ➤ %2
╚═════════════════╝
`,

      sendingNotification: `
╔📢𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡📢╗
┃ 📡 সকল গ্রুপে নোটিফিকেশন পাঠানো হচ্ছে
┃ 👥 মোট গ্রুপ ➤ %1
╚═════════════════╝
`,

      authorError: `
╔🔒𝗔𝗨𝗧𝗛𝗢𝗥 𝗟𝗢𝗖𝗞🔒╗
┃ ⛔ ফাইলের Author পরিবর্তন করা হয়েছে
┃ 🚫 সিস্টেম বন্ধ করে দেওয়া হয়েছে
╚═════════════════╝
`
    }
  },

  onStart: async function ({
    api,
    args,
    threadsData,
    message,
    getLang
  }) {

    // 🔒 STRONG AUTHOR LOCK
    const content = fs.readFileSync(__filename, "utf8");

    if (
      !content.includes(
        'const LOCKED_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"'
      )
    ) {
      console.log("🚫 AUTHOR LOCK ACTIVATED");
      return message.reply(getLang("authorError"));
    }

    if (
      module.exports.config.author !== LOCKED_AUTHOR
    ) {
      return message.reply(getLang("authorError"));
    }

    // 📝 NEW NICKNAME
    const newNickname = args.join(" ");

    if (!newNickname) {
      return message.reply(
        getLang("missingNickname")
      );
    }

    // 👥 ALL GROUPS
    const allThreadID = (
      await threadsData.getAll()
    ).filter(
      t =>
        t.isGroup &&
        t.members?.find(
          m =>
            m.userID ==
            api.getCurrentUserID()
        )?.inGroup
    );

    const threadIds = allThreadID.map(
      t => t.threadID
    );

    // 🚀 START MESSAGE
    await message.reply(
      getLang(
        "changingNickname",
        newNickname,
        allThreadID.length
      )
    );

    // 🔄 CHANGE NICKNAME
    const results = await Promise.allSettled(

      threadIds.map(async threadId => {

        await new Promise(resolve =>
          setTimeout(
            resolve,
            module.exports.config.envConfig.delayPerGroup
          )
        );

        return api.changeNickname(
          newNickname,
          threadId,
          api.getCurrentUserID()
        );
      })
    );

    // ❌ FAILED GROUPS
    const failed = results
      .filter(r => r.status === "rejected")
      .map(
        r =>
          r.reason?.message ||
          "Permission Error"
      );

    // ✅ SUCCESS
    if (failed.length === 0) {

      await message.reply(
        getLang(
          "successMessage",
          newNickname
        )
      );

    } else {

      await message.reply(
        getLang(
          "partialSuccessMessage",
          newNickname,
          failed.join(", ")
        )
      );
    }

    // 📢 NOTIFICATION
    return message.reply(
      getLang(
        "sendingNotification",
        allThreadID.length
      )
    );
  }
};
