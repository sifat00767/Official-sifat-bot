const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "info2",
    version: "5.0.0",
    author: "SIYAM-HASAN",
    role: 0,
    category: "owner"
  },

  onStart: async function ({ message }) {

    const botName = "𝐍𝐈𝐉𝐇𝐔𝐌";
    const prefix = global.GoatBot?.config?.prefix || ".";
    const commands = global.GoatBot?.commands?.size || 200;

    const now = moment().tz("Asia/Dhaka");
    const time = now.format("hh:mm:ss A");
    const date = now.format("DD MMMM YYYY");

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    return message.reply({
      body: `───────────────
 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃
───────────────

» 🤖 𝐁𝐎𝐓 𝐏𝐀𝐍𝐄𝐋
» 🤖 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 ➤
» 👉      ${botName}
» ⚡𝐏𝐑𝐄𝐅𝐈𝐗 ➤ ${prefix}
» 📦 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ➤ ${commands}
───────────────

» 🤍 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎
» 👑 𝐍𝐀𝐌𝐄 ➤ 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃
» 🎂 𝐀𝐆𝐄 ➤ 𝟏𝟗+
» 📘 𝐒𝐓𝐔𝐃𝐘 ➤ 𝐇𝐒𝐂 𝟐𝐊𝟐𝟔
» 🚹 𝐆𝐄𝐍𝐃𝐄𝐑 ➤ 𝐌𝐀𝐋𝐄
» 💔 𝐒𝐓𝐀𝐓𝐔𝐒 ➤ 𝐒𝐈𝐍𝐆𝐋𝐄
───────────────

» 💫𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋
» 👪 𝐅𝐀𝐌𝐈𝐋𝐘 ➤ 𝐎𝐍𝐋𝐘 𝐒𝐎𝐍 
» 💞 𝐆𝐅 ➤ 𝐘𝐄𝐒
» 🏠 𝐃𝐈𝐒𝐓𝐑𝐈𝐂𝐓 ➤ BOGURA
» 🌍 𝐂𝐎𝐔𝐍𝐓𝐑𝐘 ➤ 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇
───────────────

» 🎯 𝐇𝐎𝐁𝐁𝐘
» 🔥 ➤ 𝐅𝐑𝐈𝐄𝐍𝐃𝐒 𝐀𝐃𝐃𝐃𝐀
» 🏍️ ➤ 𝐁𝐈𝐊𝐄 𝐑𝐈𝐃𝐄
» 📱 ➤ 𝐕𝐈𝐃𝐄𝐎 𝐆𝐀𝐌𝐄
───────────────

»  💋 𝐒𝐏𝐄𝐂𝐈𝐀𝐋
» 😘 ➤ 𝐆𝐈𝐑𝐋𝐒 = 𝐔𝐌𝐌𝐀𝐇
───────────────

» ⏳𝐒𝐘𝐒𝐓𝐄𝐌
» 🕒 𝐓𝐈𝐌𝐄 ➤ ${time}
» 📅 𝐃𝐀𝐓𝐄 ➤ ${date}
» ⏱️ 𝐔𝐏𝐓𝐈𝐌𝐄 ➤
» ✅  ${h}𝐡 ${m}𝐦 ${s}𝐬
───────────────

╔════════════════╗
✡️ ‿𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 ✡️
╚════════════════╝

➤ 😎 আমি নিজের মতোই চলি
➤ 🔥 আমি কপি না,
➤ ⚜️ আমি আলাদা
➤ 🖤 যারে ভালোবাসি,
➤ 💖 শেষ পর্যন্ত
➤ 💀 যারে না চাই, সে নাই

» 🔥 𝐁𝐑𝐀𝐍𝐃
» 👑 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃
» ❌ 𝐍𝐎 𝐂𝐎𝐏𝐘
» ✔️ 𝐎𝐍𝐋𝐘 𝐎𝐑𝐈𝐆𝐈𝐍𝐀𝐋
───────────────`
    });
  }
};
