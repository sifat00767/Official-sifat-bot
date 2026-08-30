const { getStreamsFromAttachment } = global.utils;

const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
config: {
name: "callad",
aliases: ["call", "called"],
version: "2.0",
author: "NTKhang | Edited by Farhan",
countDown: 5,
role: 0,
category: "contacts admin",
description: {
en: "Send message or report directly to bot admin"
},
guide: {
en: "{pn} <your message>"
}
},

langs: {
en: {
missingMessage: "❌ | 𝗘𝗡𝗧𝗘𝗥 𝗔 𝗠𝗘𝗦𝗦𝗔𝗚𝗘",
noAdmin: "⚠️ | 𝗡𝗢 𝗔𝗗𝗠𝗜𝗡 𝗙𝗢𝗨𝗡𝗗",

  success: "✅ | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗦𝗘𝗡𝗧\n💌 Delivered to Bot Admin",

  replySuccess: "✅ | 𝗥𝗘𝗣𝗟𝗬 𝗦𝗘𝗡𝗧"
}

},

onStart: async function ({
args,
message,
event,
usersData,
threadsData,
api,
commandName,
getLang
}) {
if (!args[0])
return message.reply(getLang("missingMessage"));

const { senderID, threadID, isGroup } = event;
const adminBot = global.GoatBot.config.adminBot;

if (!adminBot.length)
  return message.reply(getLang("noAdmin"));

const senderName = await usersData.getName(senderID);

const groupName = isGroup
  ? ((await threadsData.get(threadID))?.threadName || "UNKNOWN GROUP")
  : "PRIVATE CHAT";

const body =
  "╭━━━👑 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃 👑━━━╮\n\n" +
  "📩 𝗡𝗘𝗪 𝗖𝗔𝗟𝗟\n\n" +
  `👤 𝗡𝗔𝗠𝗘 › ${senderName}\n` +
  `🆔 𝗨𝗜𝗗 › ${senderID}\n` +
  `👥 𝗚𝗥𝗢𝗨𝗣 › ${groupName}\n\n` +
  `💬 ${args.join(" ")}\n\n` +
  "╰━━━🌙 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 🌙━━━╯";

const formMessage = {
  body,
  mentions: [
    {
      id: senderID,
      tag: senderName
    }
  ],
  attachment: await getStreamsFromAttachment(
    [...event.attachments, ...(event.messageReply?.attachments || [])]
      .filter(item => mediaTypes.includes(item.type))
  )
};

let success = 0;

for (const uid of adminBot) {
  try {
    const info = await api.sendMessage(formMessage, uid);
    success++;

    global.GoatBot.onReply.set(info.messageID, {
      commandName,
      type: "userCallAdmin",
      threadID,
      messageIDSender: event.messageID
    });
  }
  catch (e) {
    console.error(e);
  }
}

return message.reply(getLang("success", success));

},

onReply: async function ({
args,
event,
api,
message,
Reply,
usersData,
getLang
}) {
const senderName = await usersData.getName(event.senderID);

if (Reply.type === "userCallAdmin") {
  const body =
    "╭━━━📬 𝗔𝗗𝗠𝗜𝗡 𝗥𝗘𝗣𝗟𝗬 📬━━━╮\n\n" +
    args.join(" ") +
    "\n\n╰━━━🌙 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 🌙━━━╯";

  api.sendMessage(
    { body },
    Reply.threadID,
    () => message.reply(getLang("replySuccess")),
    Reply.messageIDSender
  );
}

}
};
