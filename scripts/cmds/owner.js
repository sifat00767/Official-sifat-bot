const moment = require("moment-timezone");
const fs = require("fs");

// ================== 🔒 STRONG AUTHOR LOCK ==================
const AUTHOR = "FARHAN-KHAN";
const FILE = __filename;

(function lockFile() {
  try {
    const data = fs.readFileSync(FILE, "utf8");

    // ❌ যদি author change হয় → stop bot
    if (!data.includes(`author: "${AUTHOR}"`)) {
      console.log("🚫 AUTHOR TAMPER DETECTED!");
      process.exit(1);
    }

    // ❌ যদি design remove করা হয়
    if (!data.includes("𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢")) {
      console.log("🚫 FILE MODIFIED!");
      process.exit(1);
    }

  } catch (e) {
    console.log("Lock Error:", e);
  }
})();
// ===========================================================

module.exports = {
  config: {
    name: "owner",
    version: "4.0.0",
    author: "FARHAN-KHAN",
    role: 2,
    countDown: 10,
    shortDescription: { en: "Owner info" },
    category: "owner"
  },

  onStart: async function ({ message }) {

    const ownerFB1 = "https://www.facebook.com/share/14k1GZFVH2T/";
    const ownerFB2 = "https://www.facebook.com/share/14k1GZFVH2T/";

    const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");

    const msg = {
      body: `╔❖𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢❖╗
 
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆ 
[🤖]↓:𝐁𝐎𝐓→𝐀𝐃𝐌𝐈𝐍:↓
➤ 『 𝐑𝐈𝐒𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌 』
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
🪯🚬🪬⚔️📡✨🐸🙄🛡️

[🏠]↓:𝐀𝐃𝐃𝐑𝐄𝐒𝐒:↓
➤ 『 𝐑𝐀𝐉𝐒𝐇𝐀𝐇𝐈 』

[🕋]↓:𝐑𝐄𝐋𝐈𝐆𝐈𝐎𝐍:↓
➤ 『 𝐈𝐒𝐋𝐀𝐌 』

[🚻]↓:𝐆𝐄𝐍𝐃𝐄𝐑:↓
➤ 『 𝐌𝐀𝐋𝐄 』

[💞]↓:𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍𝐒𝐇𝐈𝐏:↓
➤ 『 𝐒𝐈𝐍𝐆𝐋𝐄 』

[🧑‍🎓]↓:𝐖𝐎𝐑𝐊:↓
➤ 『 𝐒𝐓𝐔𝐃𝐄𝐍𝐓 』

📅 Date: ${date}
⏰ Time: ${time}

╚❖👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑❖╝`
    };

    return message.reply(msg);
  }
};
