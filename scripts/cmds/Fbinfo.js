const AUTHOR = "UDAY HASAN SIYAM";

module.exports = {
  config: {
    name: "fbinfo",
    aliases: ["fb", "userinfo"],
    version: "1.2",
    author: AUTHOR + " (DO NOT CHANGE)",
    role: 0,
    shortDescription: "Facebook user info",
    longDescription: "Get Facebook user info safely",
    category: "info",
    guide: "{p}fbinfo @mention | uid"
  },

  onStart: async function ({ api, event, args, message }) {

    // 🔒 AUTHOR LOCK
    if (!this.config.author.includes(AUTHOR)) {
      return message.reply(
        "❌ Author name changed! Command locked."
      );
    }

    try {

      let uid = event.senderID;

      // Mention check
      if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      }

      // UID check
      else if (args[0] && !isNaN(args[0])) {
        uid = args[0];
      }

      const data = await api.getUserInfo(uid);
      const user = data[uid];

      if (!user) {
        return message.reply("❌ User info not found");
      }

      const gender =
        user.gender == 1 ? "Female" :
        user.gender == 2 ? "Male" :
        "Unknown";

      return message.reply(
`📘 𝗜𝗡𝗙𝗢

» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
│ » 👤 𝗡𝗮𝗺𝗲
│ ${user.name || "Unknown"}
│ » 🆔 𝗨𝗜𝗗
│ ${uid}
│ » 🌐 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲
│ ${user.vanity || "Not set"}
│ » 🚻 𝗚𝗲𝗻𝗱𝗲𝗿
│ ${gender}
│ » 🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲
│ https://facebook.com/${uid}
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`
      );

    } catch (err) {

      console.log(err);

      return message.reply(
        "⚠️ Error: fbinfo command failed"
      );

    }

  }
};
