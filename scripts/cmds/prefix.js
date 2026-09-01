const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "prefix",
    version: "2.7.0",
    author: "FARHAN-KHAN / SIFAT",
    countDown: 5,
    role: 0,
    description: "Change & show bot prefix",
    category: "config"
  },

  langs: {
    en: {
      usage: "❌ 𝐔𝐬𝐚𝐠𝐞: 𝐩𝐫𝐞𝐟𝐢𝐱 <𝐧𝐞𝐰> | 𝐩𝐫𝐞𝐟𝐢𝐱 𝐫𝐞𝐬𝐞𝐭 | 𝐩𝐫𝐞𝐟𝐢𝐱 <𝐧𝐞𝐰> -g",
      reset: "✅ 𝐏𝐫𝐞𝐟𝐢𝐱 𝐑𝐞𝐬𝐞𝐭 𝐒𝐮𝐜𝐜𝐞𝐬𝐬!\n🔰 𝐒𝐲𝐬𝐭𝐞𝐦: %1",
      onlyAdmin: "⛔ 𝐎𝐧𝐥𝐲 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧 𝐂𝐚𝐧 𝐂𝐡𝐚𝐧𝐠𝐞 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱.",
      confirmGlobal: "⚠️ 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱 𝐂𝐡𝐚𝐧𝐠𝐞?\n👉 𝐑𝐞𝐚𝐜𝐭 𝐓𝐨 𝐂𝐨𝐧𝐟𝐢𝐫𝐦",
      confirmThisThread: "⚠️ 𝐆𝐫𝐨𝐮𝐩 𝐏𝐫𝐞𝐟𝐢𝐱 𝐂𝐡𝐚𝐧𝐠𝐞?\n👉 𝐑𝐞𝐚𝐜𝐭 𝐓𝐨 𝐂𝐨𝐧𝐟𝐢𝐫𝐦",
      successGlobal: "✅ 𝐆𝐋𝐎𝐁𝐀𝐋 𝐏𝐑𝐄𝐅𝐈𝐗 𝐂𝐇𝐀𝐍𝐆𝐄𝐃!\n🆕 %1",
      successThisThread: "✅ 𝐆𝐑𝐎𝐔𝐏 𝐏𝐑𝐄𝐅𝐈𝐗 𝐂𝐇𝐀𝐍𝐆𝐄𝐃!\n🆕 %1"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.reply(getLang("usage"));

    const threadID = event.threadID;

    if (args[0] === "reset") {
      await threadsData.set(threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal && role < 2)
      return message.reply(getLang("onlyAdmin"));

    const confirmMsg = setGlobal
      ? getLang("confirmGlobal")
      : getLang("confirmThisThread");

    message.reply(
      confirmMsg,
      (err, info) => {
        if (err) return;

        global.GoatBot.onReaction.set(info.messageID, {
          commandName,
          author: event.senderID,
          newPrefix,
          setGlobal
        });
      }
    );
  },

  onReaction: async function ({ event, message, threadsData, Reaction, getLang }) {
    if (event.userID !== Reaction.author) return;

    global.GoatBot.onReaction.delete(event.messageID);

    if (Reaction.setGlobal) {
      global.GoatBot.config.prefix = Reaction.newPrefix;

      fs.writeFileSync(
        global.client.dirConfig,
        JSON.stringify(global.GoatBot.config, null, 2)
      );

      return message.reply(getLang("successGlobal", Reaction.newPrefix));
    }

    await threadsData.set(
      event.threadID,
      Reaction.newPrefix,
      "data.prefix"
    );

    return message.reply(getLang("successThisThread", Reaction.newPrefix));
  },

  onChat: async function ({ event, message, threadsData }) {
    if (!event.body || event.body.toLowerCase() !== "prefix") return;

    const threadID = event.threadID;

    const systemPrefix = global.GoatBot.config.prefix;
    const groupPrefix = global.utils.getPrefix(threadID);

    const threadInfo = await threadsData.get(threadID);
    const groupName = threadInfo?.threadName || "Unknown Group";

    const time = moment().tz("Asia/Dhaka").format("hh:mm A");
    const date = moment().tz("Asia/Dhaka").format("DD MMM YYYY");

    const owner = "𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃";

    const design = `╭👑 𝐏𝐑𝐄𝐅𝐈𝐗 𝐏𝐀𝐍𝐄𝐋 👑 ╮
🏷️ 𝐆𝐑𝐎𝐔𝐏 ➜ ${groupName}
🔰 𝐒𝐘𝐒𝐓𝐄𝐌 ➜ ${systemPrefix}
💬 𝐏𝐑𝐄𝐅𝐈𝐗 ➜ ${groupPrefix}
⏰ 𝐓𝐈𝐌𝐄 ➜ ${time}
📅 𝐃𝐀𝐓𝐄 ➜ ${date}
👑 𝐎𝐖𝐍𝐄𝐑 ➜ ${owner}
📊 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ➜ 6086+
🚀 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 ➜ V2 • V3 • V5
⚡ 𝐒𝐓𝐀𝐓𝐔𝐒 ➜ ONLINE
_⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡`;

    return message.reply(design);
  }
};
