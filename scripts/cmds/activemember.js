const axios = require("axios");

// 🔒 AUTHOR LOCK SYSTEM
const AUTHOR = "FARHAN-KHAN";

// 🔄 DESIGN SWITCH
let designToggle = 0;

module.exports = {
  config: {
    name: "activemember",
    aliases: ["am"],
    version: "2.1",
    author: AUTHOR,
    countDown: 5,
    role: 0,
    shortDescription: "Top active members",
    longDescription: "Show top active members with auto design switch",
    category: "box chat",
    guide: "{p}{n}"
  },

  onStart: async function ({ api, event }) {

    // 🔒 HARD AUTHOR LOCK
    if (module.exports.config.author !== AUTHOR) {
      return api.sendMessage(
        "⛔ AUTHOR NAME CHANGED!\n🔒 THIS FILE IS NOW LOCKED.",
        event.threadID
      );
    }

    const threadID = event.threadID;

    try {

      // 📥 THREAD INFO
      const threadInfo =
        await api.getThreadInfo(threadID);

      // 👥 PARTICIPANTS
      const participantIDs =
        threadInfo.participantIDs ||
        threadInfo.userInfo.map(u => u.id);

      // 📊 MESSAGE COUNTS
      const messageCounts = {};

      participantIDs.forEach(uid => {
        messageCounts[uid] = 0;
      });

      // 📜 THREAD HISTORY
      const history =
        await api.getThreadHistory(
          1000,
          threadID,
          undefined
        ).catch(() => []);

      // 💬 COUNT MESSAGES
      history.forEach(msg => {

        const sender = msg.senderID;

        if (
          messageCounts[sender] !== undefined
        ) {
          messageCounts[sender]++;
        }

      });

      // 🔝 TOP 5 USERS
      const topUsers = Object.entries(
        messageCounts
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

      // 🏅 MEDALS
      const medals = [
        "🥇",
        "🥈",
        "🥉",
        "✨",
        "🌙"
      ];

      let userText = "";

      // 👤 BUILD USER TEXT
      for (let i = 0; i < topUsers.length; i++) {

        const [uid, count] = topUsers[i];

        const userInfo =
          await api.getUserInfo(uid);

        const name =
          userInfo[uid]?.name || "Unknown";

        // 🎨 DESIGN 1
        if (designToggle === 0) {

          userText +=
`✦ ${medals[i]} ${name}
➥ 💬 ${count} Messages

`;

        }

        // 🎨 DESIGN 2
        else {

          userText +=
`┃ ${medals[i]} ${name}
┃ 💬 ${count} Messages

`;

        }

      }

      let finalMessage = "";

      // 🎨 FIRST DESIGN
      if (designToggle === 0) {

        finalMessage =
`» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕

${userText}» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡`;

        designToggle = 1;

      }

      // 🎨 SECOND DESIGN
      else {

        finalMessage =
`» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕

${userText}» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡`;

        designToggle = 0;

      }

      // 📤 SEND MESSAGE
      return api.sendMessage(
        finalMessage,
        threadID
      );

    } catch (err) {

      console.log(err);

      return api.sendMessage(
`»〔 ❌ 𝗘𝗥𝗥𝗢𝗥 〕
» ⚠️ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗠𝗲𝗺𝗯𝗲𝗿 𝗟𝗼𝗮𝗱 𝗙𝗮𝗶𝗹𝗲𝗱
───────────────`,
        threadID
      );

    }

  }
};
