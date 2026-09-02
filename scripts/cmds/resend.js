const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "resend",
    version: "3.0.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Resends un-sent messages with toggle options",
      bn: "আনসেন্ড করা মেসেজ পুনরায় পাঠায়"
    },
    longDescription: {
      en: "Detects un-sent/deleted messages and resends them. Stored permanently in local DB.",
      bn: "কেউ মেসেজ আনসেন্ড করলে তা আবার পাঠায়। বট রিস্টার্ট নিলেও অন থাকে।"
    },
    category: "events",
    guide: {
      en: "{p}resend [on/off]\n{p}resend [on/off] all (Only Bot Admin)"
    }
  },

  onLoad: async function () {
    if (!global.resendMessageCache) {
      global.resendMessageCache = new Map();
    }
  },

  onStart: async function ({ api, event, args, role, threadsData, message }) {
    const threadID = event.threadID;

    if (!args[0]) {
      return message.reply(
        "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
        "───────────────\n" +
        "» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n" +
        "» 📌 /resend on / off\n" +
        "» 📌 /resend on all (Bot Admin)\n" +
        "───────────────\n" +
        "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
      );
    }

    const subCommand = args[0].toLowerCase();
    const isAll = args[1] ? args[1].toLowerCase() : "";

    try {
      if (isAll === "all" || isAll === "অল") {
        if (role < 2) {
          return message.reply("» ⛔ সব গ্রুপে একসাথে অন/অফ করার ক্ষমতা শুধুমাত্র বট এডমিনের আছে!");
        }

        const allThreads = await threadsData.getAll();
        const status = (subCommand === "on" || subCommand === "অন");

        for (const thread of allThreads) {
          let settings = (await threadsData.get(thread.threadID, "settings")) || {};
          settings.resendStatus = status;
          await threadsData.set(thread.threadID, settings, "settings");
        }

        return message.reply(`» 🚀 বটের সমস্ত গ্রুপে রিসেন্ড সার্ভিস ${status ? "অন" : "অফ"} করা হলো!`);
      }

      let settings = (await threadsData.get(threadID, "settings")) || {};

      if (subCommand === "on" || subCommand === "অন") {
        settings.resendStatus = true;
        await threadsData.set(threadID, settings, "settings");
        return message.reply("» ✨ এই গ্রুপের জন্য রিসেন্ড সার্ভিস অন করা হয়েছে (ডাটাবেসে সেভড)!");
      } else if (subCommand === "off" || subCommand === "অফ") {
        settings.resendStatus = false;
        await threadsData.set(threadID, settings, "settings");
        return message.reply("» 🚫 এই গ্রুপের জন্য রিসেন্ড সার্ভিস অফ করা হয়েছে!");
      }
    } catch (err) {
      return message.reply(`» ❌ এরর: ${err.message}`);
    }
  },

  onChat: async function ({ api, event, usersData, threadsData }) {
    const { threadID, messageID, senderID, type } = event;

    if (!global.resendMessageCache) {
      global.resendMessageCache = new Map();
    }

    if (type === "message" || type === "message_reply") {
      global.resendMessageCache.set(messageID, {
        body: event.body,
        attachments: event.attachments || [],
        senderID: senderID
      });
    }

    if (type === "message_unsend") {
      const settings = (await threadsData.get(threadID, "settings")) || {};
      
      // Strict Permanent Settings Check
      if (settings.resendStatus !== true) return;

      const getMsgData = global.resendMessageCache.get(messageID);
      if (!getMsgData) return;

      const name = await usersData.getName(senderID);
      const deletedMsg = getMsgData.body ? getMsgData.body : "";

      let msgText = `❀──────তোমরা কে কোথায় আছো দেখো ${name} মেসেজ ডিলিট করেছেন: ${deletedMsg}\n\n😎😏`;

      const attachments = [];
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

      if (getMsgData.attachments && getMsgData.attachments.length > 0) {
        for (let i = 0; i < getMsgData.attachments.length; i++) {
          const item = getMsgData.attachments[i];
          const ext = item.type === "photo" ? "jpg" : item.type === "video" ? "mp4" : item.type === "audio" ? "mp3" : "bin";
          const filePath = path.join(cacheDir, `resend_${messageID}_${i}.${ext}`);

          try {
            const response = await axios.get(item.url, { responseType: "arraybuffer" });
            await fs.outputFile(filePath, Buffer.from(response.data));
            attachments.push(fs.createReadStream(filePath));
          } catch (e) {
            console.error("Attachment error:", e);
          }
        }
      }

      api.sendMessage({ body: msgText, attachment: attachments }, threadID, () => {
        if (getMsgData.attachments && getMsgData.attachments.length > 0) {
          for (let i = 0; i < getMsgData.attachments.length; i++) {
            const item = getMsgData.attachments[i];
            const ext = item.type === "photo" ? "jpg" : item.type === "video" ? "mp4" : item.type === "audio" ? "mp3" : "bin";
            const filePath = path.join(cacheDir, `resend_${messageID}_${i}.${ext}`);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
        }
      });
    }
  }
};
