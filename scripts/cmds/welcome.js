const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "welcome",
    version: "4.1.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    countDown: 5,
    shortDescription: { en: "Group welcome message and rules" },
    category: "group"
  },

  onStart: async function ({ threadsData, usersData, event, message, api }) {
    try {
      const threadID = event.threadID;
      const threadInfo = await threadsData.get(threadID);
      const threadName = threadInfo.threadName || "Group";
      const memberCount = threadInfo.members?.length || 1;

      const prefix = global.GoatBot?.config?.prefix || ".";
      const now = moment().tz("Asia/Dhaka");
      const time = now.format("hh:mm:ss A");
      const date = now.format("DD MMMM YYYY");

      // ১. নতুন সদস্যের নাম বের করা (যদি অ্যাড ইভেন্ট হয় অথবা রিপ্লাই/মেনশন হয়)
      let addedUserName = "New Member";
      let addedByUserName = "Self / Link / Admin";

      // যদি নোটিফিকেশন বা অ্যাড ইভেন্ট থেকে ডাটা আসে
      if (event.logMessageData && event.logMessageData.addedParticipants) {
        const addedUserIDs = event.logMessageData.addedParticipants.map(u => u.userFbId);
        if (addedUserIDs.length > 0) {
          addedUserName = await usersData.getName(addedUserIDs[0]);
        }
        // কে যুক্ত করেছে তার নাম
        if (event.author) {
          addedByUserName = await usersData.getName(event.author);
        }
      } else {
        // ম্যানুয়ালি কমান্ড দিলে যে কমান্ড দিয়েছে তাকে বা যাকে টার্গেট করা হয়েছে তাকে দেখানো
        const targetID = Object.keys(event.mentions)[0] || event.senderID;
        addedUserName = await usersData.getName(targetID);
        addedByUserName = await usersData.getName(event.senderID);
      }

      const welcomeMsg = `🌸 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 ${threadName.toUpperCase()} 🌸
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 : ${addedUserName}
➕ 𝗔𝗗𝗗𝗘𝗗 𝗕𝗬 : ${addedByUserName}
🤖 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘 : 𝐒𝐈𝐅𝐀𝐓 𝐂𝐇𝐀𝐓 𝐁𝐎𝐓
🏷️ 𝗚𝗥𝗢𝗨𝗣 : ${threadName}
👥 𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 : ${memberCount}
⚡ 𝗣𝗥𝗘𝗙𝗜𝗫 : [ ${prefix} ]
📅 𝗗𝗔𝗧𝗘 : ${date}
⏰ 𝗧𝗜𝗠𝗘 : ${time}
👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃

📜 ━━━〔 𝐆𝐑𝐎𝐔𝐏 𝐑𝐔𝐋𝐄𝐒 〕━━━ 📜

১. 🤝 গ্রুপের সকল সদস্যকে সম্মান প্রদর্শন করুন।
২. 🚫 অযথা কাউকে গালাগালি বা অপমানজনক কথা বলবেন না।
৩. 🔞 কোনো প্রকার ১৮+ বা অশ্লীল কনটেন্ট, ছবি বা ভিডিও শেয়ার করা সম্পূর্ণ নিষেধ।
৪. ❌ অ্যাডমিনের অনুমতি ছাড়া কোনো প্রকার লিংক বা প্রমোশন শেয়ার করবেন না।
৫. 🔇 গ্রুপে অপ্রয়োজনীয় স্প্যাম বা একাধিক টেক্সট বার বার পাঠাবেন না।
৬. ⚠️ রিলিজিয়ন, ধর্মীয় অনুভূতি বা রাজনীতি নিয়ে বিতর্ক তৈরি করা নিষিদ্ধ।
৭. 📵 কারো পার্সোনাল ইনবক্সে গিয়ে বিরক্ত করা থেকে বিরত থাকুন।
৮. 🎭 ছদ্মবেশ ধারণ করে কাউকে বিভ্রান্ত করার চেষ্টা করবেন না।
৯. 🛡️ গ্রুপের নিয়ম ভঙ্গ করলে সরাসরি কিক/ব্যান করা হবে।
১০. 👮‍♂️ অ্যাডমিন প্যানেলের সিদ্ধান্তই চূড়ান্ত বলে গণ্য হবে।
১১. 😃 সবাই মিলেমিশে সুন্দর ও বন্ধুত্বপূর্ণ পরিবেশ বজায় রাখুন।
১২. ❓ কোনো সমস্যা হলে অ্যাডমিন অথবা বট ওনারের সাথে যোগাযোগ করুন।

━━━━━━━━━━━━━━━━━━━━━━━━━
🌸 𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 for being a part of our group family!
𝐄𝐧jub 𝐲𝐨𝐮𝐫 𝐬𝐭𝐚𝐲 & 𝐡𝐚𝐯𝐞 𝐟𝐮𝐧! 😊`;

      return await message.reply(welcomeMsg);

    } catch (error) {
      console.error("[Welcome Command Error]:", error);
      return message.reply("❌ মেসেজটি পাঠাতে সমস্যা হয়েছে! দয়া করে আবার চেষ্টা করুন।");
    }
  }
};
