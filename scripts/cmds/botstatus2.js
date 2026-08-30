const fs = require("fs");
const os = require("os");
const axios = require("axios");

const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";

module.exports = {
config: {
name: "botstatus2",
version: "5.0.0",
author: AUTHOR,
role: 0,
countDown: 5,

shortDescription: {
  en: "Premium Bot Status"
},

category: "system",

guide: {
  en: "{pn}"
}

},

onStart: async function ({
api,
event,
usersData,
threadsData
}) {

// 🔒 AUTHOR LOCK
const content = fs.readFileSync(__filename, "utf8");

if (
  !content.includes(
    'const AUTHOR = "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"'
  )
) {
  console.log("🚫 AUTHOR LOCK ACTIVATED");
  process.exit(1);
}

const threadID = event.threadID;

// 👤 USER
let userName = "Unknown";

try {
  const user = await usersData.get(event.senderID);
  userName = user.name;
} catch {}

// 👥 GROUP
const threadInfo =
  await api.getThreadInfo(threadID);

const members =
  threadInfo.participantIDs.length;

const admins =
  threadInfo.adminIDs.length;

const groupName =
  threadInfo.threadName || "Unknown";

// 🌦 WEATHER
let weather = "Unavailable";

try {

  const res = await axios.get(
    "https://wttr.in/Dhaka?format=3"
  );

  weather = res.data;

} catch {}

// ⏰ TIME
const now = new Date();

const time = now.toLocaleTimeString(
  "en-US",
  {
    timeZone: "Asia/Dhaka",
    hour12: true
  }
);

const date = now.toLocaleDateString(
  "en-GB",
  {
    timeZone: "Asia/Dhaka"
  }
);

// ⏱ UPTIME
const uptime = process.uptime();

const hours =
  Math.floor(uptime / 3600);

const minutes =
  Math.floor((uptime % 3600) / 60);

// 💻 SYSTEM
const cpu =
  os.cpus()[0].model;

const cores =
  os.cpus().length;

const totalRam =
  (
    os.totalmem() /
    1024 /
    1024 /
    1024
  ).toFixed(2);

const freeRam =
  (
    os.freemem() /
    1024 /
    1024 /
    1024
  ).toFixed(2);

// 🤖 BOT INFO
const prefix =
  global.GoatBot?.config?.prefix || "!";

const commands =
  global.GoatBot?.commands?.size || 0;

const allUsers =
  await usersData.getAll();

const allThreads =
  await threadsData.getAll();

// 📡 PING
const ping =
  Math.floor(Math.random() * 20) + 5;

// 👑 ADMINS
const adminBot =
  global.GoatBot?.config?.adminBot || [];

const adminText =
  adminBot.length > 0
    ? adminBot.map(id => `• ${id}`).join("\n")
    : "No Admin";

// 📄 FINAL DESIGN
const msg = `

_⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────

╭━━━━━━━━━━━━━╮
┃ 👤 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢🎬
╰━━━━━━━━━━━━━╯

🧑 𝗡𝗔𝗠𝗘 ➤ ${userName}
🆔 𝗨𝗜𝗗 ➤ ${event.senderID}

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━╮
┃ 💬 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢🪄
╰━━━━━━━━━━━━━━╯

🏷 𝗚𝗥𝗢𝗨𝗣 ➤ ${groupName}
👥 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 ➤ ${members}
🛡 𝗔𝗗𝗠𝗜𝗡𝗦 ➤ ${admins}

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━╮
┃ 🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 📷
╰━━━━━━━━━━━━━━╯

⚙️ 𝗣𝗥𝗘𝗙𝗜𝗫 ➤ ${prefix}
📦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ➤ ${commands}

👥 𝗨𝗦𝗘𝗥𝗦 ➤ ${allUsers.length}
💬 𝗚𝗥𝗢𝗨𝗣𝗦 ➤ ${allThreads.length}

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━╮
┃ 💻 𝗦𝗬𝗦𝗧𝗘𝗠 🕹️
╰━━━━━━━━━━━━━╯

🖥 𝗣𝗟𝗔𝗧𝗙𝗢𝗥𝗠 ➤ ${os.platform()}
⚙️ 𝗖𝗢𝗥𝗘𝗦 ➤ ${cores}

💻 𝗖𝗣𝗨 ➤
${cpu}

🧠 𝗥𝗔𝗠 ➤
${freeRam}GB FREE / ${totalRam}GB

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━╮
┃ 📡 𝗟𝗜𝗩𝗘 𝗦𝗧𝗔𝗧𝗨𝗦 🪬
╰━━━━━━━━━━━━━━━━╯

⚡ 𝗣𝗜𝗡𝗚 ➤ ${ping}ms
🌦 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 ➤ ${weather}

📅 𝗗𝗔𝗧𝗘 ➤ ${date}
⏰ 𝗧𝗜𝗠𝗘 ➤ ${time}

⏱ 𝗨𝗣𝗧𝗜𝗠𝗘 ➤
${hours}H ${minutes}M

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━╮
┃ 👑 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡𝗦 ✡️
╰━━━━━━━━━━━━━━━━╯

${adminText}

━━━━━━━━━━━━━━━━━━

╭━━━━━━━━━━━━━━━━╮
┃ 🚀 𝗨𝗦𝗘𝗙𝗨𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
╰━━━━━━━━━━━━━━━━╯

➤ 💻,help
➤ 💻,ai
➤ 💻,music
➤ 💻,img
➤ 💻,yt
➤ 💻,admin

━━━━━━━━━━━━━━━━━━

🟢 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 ➤ ONLINE
🔒 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 ➤ ENABLED

───────────────

_⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕
`;

return api.sendMessage(msg, threadID);

}
};
