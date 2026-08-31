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
      body: `❖𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢❖
 
» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🏠 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐁𝐨𝐠𝐮𝐫𝐚
» 🌙 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦
» 🚻 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞 
» 💞𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : 𝐒𝐢𝐧𝐠𝐥𝐞 
» 🧑‍🎓𝐖𝐨𝐫𝐤 : 𝐒𝐭𝐮𝐝𝐞𝐧𝐭 
» 📅 Date: ${date}
» ⏰ Time: ${time}
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
    };

    return message.reply(msg);
  }
};
