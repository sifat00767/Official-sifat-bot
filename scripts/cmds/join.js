// 😼 Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 😼
// ⚠️ নাম চেঞ্জ করলে ফাইল নষ্ট হয়ে যাবে ভাই 😾

const AUTHOR_LOCK = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";
const VISIBLE_AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

let designIndex = 0;

module.exports = {
  config: {
    name: "join",
    version: "1.4.0",
    author: VISIBLE_AUTHOR,
    countDown: 5,
    role: 2, // 2 = Only Bot Admin
    description: "Get all active group list and join by serial number",
    category: "System",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, threadsData, message }) {
    if (VISIBLE_AUTHOR !== AUTHOR_LOCK) {
      return message.reply("⚠️ Author Lock Changed! File Locked.");
    }

    const { threadID, messageID, senderID } = event;

    try {
      // 1. Get all threads from database
      const allThreads = await threadsData.getAll();
      const botID = api.getCurrentUserID();

      // 2. Filter ONLY groups where the bot is currently an active member
      const activeGroupList = [];

      for (const thread of allThreads) {
        if (!thread.isGroup || !thread.threadID) continue;

        // Check if members data exists and if bot's ID is still in members list
        const members = thread.members || [];
        const isBotInGroup = members.some(m => (m.userID || m.id) === botID && m.inGroup !== false);

        // If thread status is active and bot is in group, add to list
        if (thread.status === true || isBotInGroup) {
          activeGroupList.push(thread);
        }
      }

      if (!activeGroupList || activeGroupList.length === 0) {
        return message.reply("❌ মামা, বট বর্তমানে যেসব গ্রুপে যুক্ত আছে তার কোনো তথ্য পাওয়া যায়নি।");
      }

      const designs = [
        (groupList) => {
          let text = `📜 𝐆𝐫𝐨𝐮𝐩 𝐋𝐢𝐬𝐭 📜\n━━━━━━━━━━━━━━━━━\n`;
          groupList.forEach((group, index) => {
            const threadInfo = group.threadInfo || {};
            text += `${index + 1}. ${threadInfo.threadName || group.threadName || "Unknown Group"}\n`;
          });
          text += `\n━━━━━━━━━━━━━━━━━\n👉 যে গ্রুপে জয়েন হতে চান, সেই সিরিয়াল নাম্বারটি লিখে রিপ্লাই দিন।`;
          return text;
        },

        (groupList) => {
          let text = `╭─❖ 𝐕𝐈𝐏 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 ❖─╮\n\n`;
          groupList.forEach((group, index) => {
            const threadInfo = group.threadInfo || {};
            text += `┃ ${index + 1} ➤ ${threadInfo.threadName || group.threadName || "Unknown Group"}\n`;
          });
          text += `\n╰────────❖────────╯\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑\n👑 ${VISIBLE_AUTHOR} 👑\n\n🪬 যে গ্রুপে জয়েন হতে চান,\n🔢 সেই নাম্বারটি রিপ্লাই দিন。\n╰────────❖────────╯`;
          return text;
        },

        (groupList) => {
          let text = `┏❖💠 𝐆𝐑𝐎𝐔𝐏 𝐏𝐀𝐍𝐄𝐋 💠❖┓\n`;
          groupList.forEach((group, index) => {
            const threadInfo = group.threadInfo || {};
            text += ` 〔 ${index + 1} 〕${threadInfo.threadName || group.threadName || "Unknown Group"}\n`;
          });
          text += `\n┗━━❖━━━━━━━━━❖━━┛\n👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑\n👑 ${VISIBLE_AUTHOR} 👑\n\n👉 যে গ্রুপে জয়েন হতে চান, সেই নাম্বারটি রিপ্লাই দিন।\n┗━━❖━━━ ━━━ ━━━❖━━┛`;
          return text;
        }
      ];

      const msg = designs[designIndex](activeGroupList);

      designIndex++;
      if (designIndex >= designs.length) {
        designIndex = 0;
      }

      return message.reply(msg, (err, info) => {
        if (err) return console.error(err);

        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: senderID,
          groupList: activeGroupList.map(g => ({
            threadID: g.threadID,
            name: (g.threadInfo ? g.threadInfo.threadName : g.threadName) || "Group"
          }))
        });
      });

    } catch (e) {
      console.error(e);
      return message.reply("❌ এরর: গ্রুপের লিস্ট পাওয়া যাচ্ছে না। কিছুক্ষণ পর ট্রাই করো।");
    }
  },

  onReply: async function ({ api, event, Reply, message }) {
    const { threadID, messageID, body, senderID } = event;
    const { author, groupList } = Reply;

    if (author !== senderID) return;

    const index = parseInt(body) - 1;

    if (isNaN(body) || index < 0 || !groupList[index]) {
      return message.reply("❌ মামা, ভুল সিরিয়াল নাম্বার দিয়েছেন। সঠিক নাম্বার লিখে রিপ্লাই দিন।");
    }

    const targetGroup = groupList[index];
    const targetThreadID = targetGroup.threadID;

    try {
      await api.addUserToGroup(senderID, targetThreadID);

      message.reply(`✅ সাকসেস! আপনাকে "${targetGroup.name || "ঐ গ্রুপে"}" অ্যাড করা হয়েছে।`);

      api.sendMessage(
        `🔔 ${VISIBLE_AUTHOR} এই গ্রুপে জয়েন করেছেন।`,
        targetThreadID
      );

    } catch (err) {
      message.reply(
        `❌ মামা অ্যাড করা যাচ্ছে না। হয়তো আপনি অলরেডি গ্রুপে আছেন বা বট ঐ গ্রুপের এডমিন না।\nGroup ID: ${targetThreadID}`
      );
    }

    global.GoatBot.onReply.delete(Reply.messageID);
  }
};
