const axios = require("axios");
const dns = require("dns").promises;
const https = require("https");

module.exports = {
  config: {
    name: "webinfo",
    version: "2.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Get detailed information about any website" },
    description: {
      en: "Fetch full info like IP, SSL, Server, Response, Country from any website"
    },
    category: "ai",
    guide: { en: "{p}webinfo <url>\nExample: {p}webinfo https://google.com" }
  },

  langs: {
    en: {
      missing: `⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗨𝗥𝗟\n───────────────\n» 📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲 : webinfo google.com`,
      loading: `🔍 𝗔𝗡𝗔𝗟𝗬𝗭𝗜𝗡𝗚 𝗪𝗘𝗕𝗦𝗜𝗧𝗘\n───────────────\n» 🌐 %1`,
      error: `❌ 𝗙𝗔𝗜𝗟𝗘𝗗 𝗧𝗢 𝗙𝗘𝗧𝗖𝗛 𝗪𝗘𝗕 𝗜𝗡𝗙𝗢\n───────────────\n» 🌐 𝗨𝗻𝗮𝗯𝗹𝗲 𝗧𝗼 𝗥𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗪𝗲𝗯𝘀𝗶𝘁𝗲 𝗗𝗮𝘁𝗮\n───────────────\n» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡`
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    try {
      // ----------- CLEAN URL -----------
      let input = args[0].trim();
      input = input.replace(/^https?:\/\//, "");
      input = input.replace(/^www\./, "");
      input = input.replace(/\/$/, "");
      const domain = input;
      const url = `https://${domain}`;

      await message.reply(getLang("loading", domain));

      // ----------- IP RESOLVE -----------
      let ip = "N/A";
      try {
        const dnsRes = await dns.lookup(domain);
        ip = dnsRes.address;
      } catch {}

      // ----------- SSL CHECK -----------
      let ssl = "🔴  Nᴏ Sᴇᴄᴜʀᴇ";
      try {
        await new Promise((resolve) => {
          const req = https.request(
            { host: domain, method: "HEAD", port: 443 },
            () => resolve((ssl = "🟢  Vᴀʟɪᴅ"))
          );
          req.on("error", () => resolve());
          req.end();
        });
      } catch {}

      // ----------- RESPONSE TIME & SERVER -----------
      let responseTime = "N/A";
      let server = "Uɴᴋɴᴏᴡɴ";
      try {
        const start = Date.now();
        const res = await axios.get(url, { timeout: 10000 });
        responseTime = Date.now() - start;
        server = res.headers["server"] || "Uɴᴋɴᴏᴡɴ";
      } catch {}

      // ----------- COUNTRY (IP API) -----------
      let country = "N/A";
      try {
        const geo = await axios.get(`https://ipapi.co/${ip}/json/`);
        country = geo.data.country_name || "N/A";
      } catch {}

      // ----------- REPLY -----------
      const output = `🌐 𝗪𝗘𝗕𝗦𝗜𝗧𝗘 𝗜𝗡𝗙𝗢
───────────────
» 🔗 𝗗𝗢𝗠𝗔𝗜𝗡 : ${domain}
» 📍 𝗜𝗣 : ${ip}
» 🛡️ 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 : ${ssl}
» ⚡ 替代 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 : ${responseTime} ms
» 🧠 𝗦𝗘𝗥𝗩𝗘𝗥 : ${server}
» 🌍 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 : ${country}
───────────────
» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡`;

      message.reply(output);

    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
