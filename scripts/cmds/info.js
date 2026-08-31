const moment = require("moment-timezone");

let videoIndex = 0; // ✅ Video rotation system

module.exports = {
config: {
name: "info",
version: "4.1.2",
author: "Siyam",
role: 0,
countDown: 20,
shortDescription: {
en: "Owner & bot info"
},
longDescription: {
en: "Show full stylish info"
},
category: "owner",
guide: {
en: "{pn}"
}
},

onStart: async function ({ message, event, api }) {

const totalCommands = global.GoatBot?.commands?.size || 0;  

const now = moment().tz("Asia/Dhaka");  
const date = now.format("MMMM Do YYYY");  
const time = now.format("h:mm:ss A");  

const uptime = process.uptime();  
const days = Math.floor(uptime / 86400);  
const hours = Math.floor((uptime % 86400) / 3600);  
const minutes = Math.floor((uptime % 3600) / 60);  
const seconds = Math.floor(uptime % 60);  

const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;  

const prefix = global.utils.getPrefix(event.threadID);  
const groupName = event.threadName || "Unknown Group";  

// ✅ AUTO BOT NAME SYSTEM  
let botName = "Unknown Bot";  
try {  
  const botID = api.getCurrentUserID();  
  const botInfo = await api.getUserInfo(botID);  
  botName = botInfo[botID]?.name || "Bot";  
} catch (e) {}  

// ✅ VIDEO LIST
const videos = [
  "https://files.catbox.moe/8f2fc5.mp4",
  "https://files.catbox.moe/3aikdw.mp4"
];

// ✅ AUTO CHANGE VIDEO
const videoLink = videos[videoIndex];
videoIndex = (videoIndex + 1) % videos.length;

return message.reply({  
  body: `

👑 ╭─❖ 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 ❖─╮
╰➤ 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃

🤖 ╭─❖ 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 ❖─╮
╰➤ ${botName}

🎂 ╭─❖ 𝐀𝐆𝐄 ❖─╮
╰➤ 𝟏9+

🚻 ╭─❖ 𝐆𝐄𝐍𝐃𝐄𝐑 ❖─╮
╰➤ 𝐌𝐀𝐋𝐄

☪ ╭─❖ 𝐑𝐄𝐋𝐈𝐆𝐈𝐎𝐍 ❖─╮
╰➤ 𝐈𝐒𝐋𝐀𝐌

👑 ╭─❖ 𝐆𝐑𝐎𝐔𝐏 ❖─╮
╰➤ ${groupName}

⚙️ ╭─❖ 𝐏𝐑𝐄𝐅𝐈𝐗 ❖─╮
╰➤ ${prefix}

💬 ╭─❖ 𝐇𝐄𝐋𝐏 ❖─╮
╰➤ ${prefix}help2

📦 ╭─❖ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ❖─╮
╰➤ ${totalCommands}

⏳ ╭─❖ 𝐔𝐏𝐓𝐈𝐌𝐄 ❖─╮
╰➤ ${uptimeString}

🕒 ╭─❖ 𝐓𝐈𝐌𝐄 ❖─╮
╰➤ ${time}

📅 ╭─❖ 𝐃𝐀𝐓𝐄 ❖─╮
╰➤ ${date}

🏠 ╭─❖ 𝐀𝐃𝐃𝐑𝐄𝐒𝐒 ❖─╮
╰➤ 𝐁𝐎𝐆𝐔𝐑𝐀 → 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇

💔 ╭─❖ 𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍𝐒𝐇𝐈𝐏 ❖─╮
╰➤ 𝐒𝐈𝐍𝐆𝐋𝐄

🛠 ╭─❖ 𝐖𝐎𝐑𝐊 ❖─╮
╰➤𝐒𝐓𝐔𝐃𝐄𝐍𝐓

╰━━━━━❖✡️❖━━━━━╯
`,
attachment: await global.utils.getStreamFromURL(videoLink)
});
}
};
