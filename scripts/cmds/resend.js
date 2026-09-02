const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "resend",
    version: "2.3.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Resends un-sent messages with toggle options",
      bn: "আনসেন্ড করা মেসেজ পুনরায় পাঠায়"
    },
    longDescription: {
      en: "Detects un-sent/deleted messages and resends them with attachment support. Status is permanently stored in database.",
      bn: "কেউ মেসেজ আনসেন্ড করলে তা চিহ্নিত করে পিকচার/ভিডিও সহ আবার চ্যাটে পাঠিয়ে দেয়। বট রিস্টার্ট হলেও ডাটাবেসে অন/অফ সেভ থাকবে।"
    },
    category: "events",
    guide: {
      en: "{p}resend [on/off]\n{p}resend [on/off] all (Only Bot Admin)\n{p}resend [অন/অফ]\n{p}resend [অন/অফ] অল (শুধুমাত্র বট এডমিন)"
    }
  },

  languages: {
    vi: {},
    en: {},
    bn: {}
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
        "» 📌 /resend অন / অফ\n" +
        "» 📌 /resend on all (Bot Admin)\n" +
        "» 📌 /resend অন অল (Bot Admin)\n" +
        "───────────────\n" +
        "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
      );
    }

    const subCommand = args[0].toLowerCase();
    const isAll = args[1] ? args[1].toLowerCase() : "";

    try {
      // Global / All Toggle (On or Off for all threads)
      if (isAll === "all" || isAll === "অল") {
        if (role < 2) {
          return message.reply(
            "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
            "───────────────\n" +
            "» ⚠️ _⁠-𝑨𝒄𝒄𝒆𝒔𝒔 𝑫𝒆𝒏𝒊𝒆𝒅\n" +
            "» ⛔ সব গ্রুপে একসাথে অন/অফ করার ক্ষমতা শুধুমাত্র বট এডমিনের আছে!\n" +
            "───────────────\n" +
            "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
          );
        }

        if (subCommand === "on" || subCommand === "অন") {
          const allThreads = await threadsData.getAll();
          for (const thread of allThreads) {
            await threadsData.set(thread.threadID, true, "data.resendStatus");
          }
          return message.reply(
            "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
            "───────────────\n" +
            "» 🛡️ _⁠-𝑹𝒆𝒔𝒆𝒏𝒅 𝑨𝒍𝒍 𝑬𝒏𝒂𝒃𝒍𝑬𝑫\n" +
            "» 🚀 বটের সমস্ত গ্রুপে রিসেন্ড সার্ভিস অন করা হলো!\n" +
            "───────────────\n" +
            "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
          );
        } else if (subCommand === "off" || subCommand === "অফ") {
          const allThreads = await threadsData.getAll();
          for (const thread of allThreads) {
            await threadsData.set(thread.threadID, false, "data.resendStatus");
          }
          return message.reply(
            "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
            "───────────────\n" +
            "» 🔓 _⁠-𝑹𝒆𝒔𝒆𝒏𝒅 𝑨𝒍𝒍 𝑫𝒊𝒔𝒂𝒃𝒍𝒆𝒅\n" +
            "» 🚫 বটের সমস্ত গ্রুপে রিসেন্ড সার্ভিস অফ করা হলো!\n" +
            "───────────────\n" +
            "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
          );
        }
      }

      // Specific Thread Toggle (Only for current thread)
      if (subCommand === "on" || subCommand === "অন") {
        await threadsData.set(threadID, true, "data.resendStatus");
        return message.reply(
          "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
          "───────────────\n" +
          "» 🛡️ _⁠-𝑹𝒆𝒔𝒆𝒏𝒅 𝑬𝒏𝒂𝒃𝒍𝑬𝑫\n" +
          "» ✨ এই গ্রুপের জন্য রিসেন্ড সার্ভিস অন করা হয়েছে!\n" +
          "───────────────\n" +
          "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
        );
      } else if (subCommand === "off" || subCommand === "অফ") {
        await threadsData.set(threadID, false, "data.resendStatus");
        return message.reply(
          "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
          "───────────────\n" +
          "» 🔓 _⁠-𝑹𝒆𝒔𝒆𝒏𝒅 𝑫𝒊𝒔𝒂𝒃𝒍𝒆𝒅\n" +
          "» 🚫 এই গ্রুপের জন্য রিসেন্ড সার্ভিস অফ করা হয়েছে!\n" +
          "───────────────\n" +
          "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
        );
      } else {
        return message.reply(
          "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
          "───────────────\n" +
          "» ⚠️ _⁠-𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝑶𝒑𝒕𝒊𝒐𝒏\n" +
          "» 📌 অনুগ্রহ করে 'on'/'off' অথবা 'অন'/'অফ' টাইপ করুন।\n" +
          "───────────────\n" +
          "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
        );
      }
    } catch (err) {
      return message.reply(`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n───────────────\n» ⚠️ _⁠-𝑬𝒓𝒓𝒐𝒓\n» ❌ অন/অফ করতে সমস্যা হয়েছে: ${err.message}\n───────────────\n» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`);
    }
  },

  onChat: async function ({ api, event, usersData, threadsData }) {
    const { threadID, messageID, senderID, type } = event;

    if (!global.resendMessageCache) {
      global.resendMessageCache = new Map();
    }

    // চ্যাট বার্তাগুলো সাময়িকভাবে মেমোরি ক্যাশে সেভ করা
    if (type === "message" || type === "message_reply") {
      global.resendMessageCache.set(messageID, {
        body: event.body,
        attachments: event.attachments || [],
        senderID: senderID
      });
    }

    // আনসেন্ড বা মেসেজ রিমুভ ইভেন্ট ধরা
    if (type === "message_unsend") {
      // Strict Database Check (ডাটাবেসে ট্রু না থাকলে কাজ করবে না)
      const resendStatus = await threadsData.get(threadID, "data.resendStatus");
      if (resendStatus !== true) return;

      const getMsgData = global.resendMessageCache.get(messageID);
      if (!getMsgData) return;

      const name = await usersData.getName(senderID);
      const deletedMsg = getMsgData.body ? getMsgData.body : "";

      let msgText = `❀──────তোমরা কে কোথায় আছো দেখো ${name} মেসেজ ডিলিট করেছেন ${deletedMsg}\n\n😎😏`;

      const attachments = [];
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

      // পিকচার/ভিডিও/অডিও ডাউনলোড
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
            console.error("Attachment download error:", e);
          }
        }
      }

      // মেসেজ ব্যাক পাঠানো ও ফাইল ক্লিনআপ
      api.sendMessage({ body: msgText, attachment: attachments }, threadID, () => {
        if (getMsgData.attachments && getMsgData.attachments.length > 0) {
          for (let i = 0; i < getMsgData.attachments.length; i++) {
            const item = getMsgData.attachments[i];
            const ext = item.type === "photo" ? "jpg" : item.type === "video" ? "mp4" : item.type === "audio" ? "mp3" : "bin";
            const filePath = path.join(cacheDir, `resend_${messageID}_${i}.${ext}`);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        }
      });
    }
  }
};
