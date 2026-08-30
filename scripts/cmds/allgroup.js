module.exports = {

  config: {
    name: "allgroup",
    aliases: ["allgc"],
    version: "5.0",
    role: 2, // 🔒 Strictly Bot Admin Only
    author: "亗 SIYAM HASAN 亗",
    description: "Premium All Group Panel (Only My Active Facebook Account Groups)",
    category: "admin",
    countDown: 5,
    guide: {
      en: "{pn}"
    }
  },

  // =========================
  // START COMMAND
  // =========================

  onStart: async function ({
    api,
    event,
    message,
    commandName,
    threadsData
  }) {

    try {
      // বটের ফেসবুক আইডির নিজের ID নেওয়া
      const botUserID = api.getCurrentUserID();

      // ডাটাবেজ থেকে সমস্ত গ্রুপ ডাটা নিয়ে আসা
      const allThreads = await threadsData.getAll();

      // 🎯 STRICT FILTERING: 
      // ১. এটি অবশ্যই গ্রুপ হতে হবে
      // ২. বর্তমান গ্রুপ বাদে বাকিগুলো হতে হবে
      // ৩. আপনার বটের ফেসবুক আইডিটিকে এই মুহূর্তে ওই গ্রুপের ভেতরে 'inGroup: true' অবস্থায় থাকতে হবে
      const myActiveGroups = allThreads.filter(thread => {
        if (!thread.isGroup || thread.threadID == event.threadID) return false;
        
        // মেম্বার লিস্টের ভেতর আপনার বট আইডি উপস্থিত ও Active আছে কিনা চেক
        if (thread.members && Array.isArray(thread.members)) {
          const isBotInGroup = thread.members.some(
            m => m.userID === botUserID && m.inGroup === true
          );
          return isBotInGroup;
        }
        return false;
      });

      if (!myActiveGroups || !myActiveGroups.length) {
        return message.reply("❌ Your Bot account is currently not active in any other group.");
      }

      let msg =
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡

» _⁠-𝗔𝗖𝗧𝗜𝗩𝗘 𝗚𝗥𝗢𝗨𝗣 𝗟𝗜𝗦𝗧 
───────────────
`;

      const saveGroup = [];

      for (let i = 0; i < myActiveGroups.length; i++) {
        const group = myActiveGroups[i];
        
        // কেবল যেসব মেম্বার বর্তমানে গ্রুপে আছে তাদের সংখ্যা গণনা
        const activeMembersCount = group.members 
          ? group.members.filter(m => m.inGroup === true).length 
          : 0;

        const groupName = group.threadName || "Unnamed Group";

        msg +=
`» 💎 ${i + 1} ➤ ${groupName}
» 🆔 𝐆𝐂 𝐈𝐃 ➤ ${group.threadID}
» 👥 𝐌𝐄𝐌𝐁𝐄𝐑 ➤ ${activeMembersCount}
»
`;

        saveGroup.push(group.threadID);
      }

      msg +=
`───────────────
» _⁠-𝐑𝐄𝐏𝐋𝐘 𝐂𝐎𝐍𝐓𝐑𝐎🇱 𝐏𝐀𝐍𝐄🇱 

» 🚪 out 1
» ➤ Leave Selected Group

» ➕ add 2
» ➤ Add Yourself In Group

» 🚫 ban 3
» ➤ Ban & Auto Leave Group

───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;

      const info = await message.reply(msg);

      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        groupData: saveGroup
      });

    } catch (err) {
      console.log(err);
      return message.reply("❌ System Error:\n" + err.message);
    }
  },

  // =========================
  // REPLY SYSTEM
  // =========================

  onReply: async function ({
    api,
    event,
    Reply,
    message,
    threadsData
  }) {

    try {
      if (event.senderID != Reply.author) return;

      if (!event.body) return;
      const args = event.body.trim().split(/\s+/);
      const cmd = args[0]?.toLowerCase();
      const num = parseInt(args[1]);

      if (!cmd || isNaN(num)) {
        return message.reply("❌ Invalid reply format. Example: out 1");
      }

      const threadID = Reply.groupData[num - 1];

      if (!threadID) {
        return message.reply("❌ Group not found in panel list.");
      }

      // =====================
      // OUT SYSTEM
      // =====================
      if (cmd === "out") {
        try {
          await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
          return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ✅ LEFT SUCCESS
» 🆔 ${threadID}
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
          );
        } catch {
          return message.reply("❌ Failed to leave group.");
        }
      }

      // =====================
      // ADD SYSTEM
      // =====================
      if (cmd === "add") {
        try {
          await api.addUserToGroup(event.senderID, threadID);
          return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ✅ ADD SUCCESS
» 🆔 ${threadID}
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
          );
        } catch {
          return message.reply("❌ Failed to add user to group.");
        }
      }

      // =====================
      // BAN SYSTEM
      // =====================
      if (cmd === "ban") {
        try {
          const oldData = (await threadsData.get(threadID)) || {};
          if (!oldData.data) oldData.data = {};

          oldData.data.banned = true;

          await threadsData.set(threadID, oldData.data, "data");

          try {
            await api.sendMessage("🚫 This group has been banned by Bot Owner.", threadID);
            await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
          } catch(e) {}

          return message.reply(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🚫 BAN SUCCESS
» 🆔 ${threadID}
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
          );
        } catch {
          return message.reply("❌ Failed to ban group.");
        }
      }

    } catch (err) {
      console.log(err);
      return message.reply("❌ Reply Error:\n" + err.message);
    }
  }
};
