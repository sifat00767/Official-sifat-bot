const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "antioutlink",
    version: "1.5.0",
    author: "Sifat",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Anti outlink with group admin & bot admin bypass",
      bn: "গ্রুপ এডমিন ও বট এডমিন ছাড়া সাধারণ কেউ লিংক দিলে অটো কিক ও মেসেজ ডিলিট করে"
    },
    longDescription: {
      en: "Detects group/community links and kicks normal members, bypassing bot admins and thread admins.",
      bn: "গ্রুপ বা কম্যুনিটির লিংক দিলে সাধারণ মেম্বারদের কিক করবে, তবে বট এডমিন ও ওই গ্রুপের এডমিনরা সেফ থাকবে।"
    },
    category: "box-chat",
    guide: {
      en: "Auto detects links for normal members only."
    }
  },

  languages: {
    vi: {},
    en: {},
    bn: {}
  },

  onStart: async function ({ message }) {
    return message.reply(
      "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
      "───────────────\n" +
      "» 🛡️ _⁠-𝑨𝒏𝒕𝒊 𝑶𝒖𝒕𝒍𝒊𝒏𝒌 𝑺𝒚𝒔𝒕𝒆𝒎\n" +
      "» 📌 এই কমান্ডটি অটোমেটিক ব্যাকগ্রাউন্ডে সক্রিয় থাকে।\n" +
      "» 📌 গ্রুপ এডমিন ও বট এডমিন ছাড়া অন্য কেউ লিংক দিলেই মেসেজ ডিলিট ও ইউজার কিক হবে।\n" +
      "───────────────\n" +
      "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
    );
  },

  onChat: async function ({ api, event, usersData, message, threadsData }) {
    const { threadID, messageID, senderID, body } = event;

    // মেসেজ ফাঁকা থাকলে বা বট নিজের মেসেজ দিলে স্কিপ করবে
    if (!body || senderID === api.getCurrentUserID()) return;

    // 🔍 মেসেঞ্জার গ্রুপ, কম্যুনিটি, কম্যুনিটি সাব-চ্যাট (/ch/), হোয়াটসঅ্যাপ ও টেলিগ্রাম লিঙ্ক শনাক্তকরণ
    const linkRegex = /(m\.me\/j\/|m\.me\/cm\/|m\.me\/ch\/|facebook\.com\/cm\/|messenger\.com\/cm\/|send_source=cm|chat\.whatsapp\.com|facebook\.com\/groups|facebook\.com\/j\/|fb\.me\/g\/|t\.me\/)/i;

    if (linkRegex.test(body)) {
      try {
        // 🛡️ ১. বট এডমিন (Bot Admin) সেফটি চেক
        const botAdmins = global.GoatBot?.config?.adminBot || global.config?.ADMINBOT || [];
        if (botAdmins.includes(senderID)) return;

        // 🛡️ ২. ওই চ্যাট/গ্রুপের এডমিন (Group Admin) সেফটি চেক
        let threadInfo = {};
        try {
          if (threadsData && typeof threadsData.get === "function") {
            threadInfo = await threadsData.get(threadID);
          } else {
            threadInfo = await api.getThreadInfo(threadID);
          }
        } catch (e) {
          threadInfo = await api.getThreadInfo(threadID);
        }

        const adminIDs = threadInfo?.adminIDs || [];
        const isGroupAdmin = adminIDs.some(admin => admin.id === senderID);

        // ইউজার যদি ওই গ্রুপের এডমিন হয়, তবে কিক করবে না (স্কিপ করবে)
        if (isGroupAdmin) return;

        // ------------------ [ সাধারণ মেম্বারদের জন্য অ্যাকশন ] ------------------

        // ৩️⃣ লিঙ্ক সম্বলিত মেসেজটি আনসেন্ড / ডিলিট করা
        try {
          if (message && typeof message.unsend === "function") {
            await message.unsend(messageID);
          } else {
            await api.unsendMessage(messageID);
          }
        } catch (e) {
          try {
            await api.unsendMessage(messageID);
          } catch (err) {
            console.log("[AntiOutlink]: Unsend failed. Make sure the bot is Group Admin!");
          }
        }

        // ৪️⃣ ইউজারের তথ্য সংগ্রহ (নাম ও সময়)
        let name = "User";
        try {
          name = await usersData.getName(senderID);
        } catch (e) {
          name = "Facebook User";
        }
        const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A, DD/MM/YYYY");

        // ৫️⃣ গ্রুপে ওয়ার্নিং নোটিশ পাঠানো
        const warningMsg = 
          "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
          "───────────────\n" +
          "» ⚠️ _⁠-𝑶𝒖𝒕𝒍𝒊𝒏𝒌 𝑫𝒆𝒕𝒆𝒄𝒕𝒆𝒅!\n" +
          "» 📌 অনুমতি ছাড়া লিংক শেয়ার করার কারণে সাধারণ মেম্বারকে কিক করা হলো।\n\n" +
          `» 👤 _⁠-𝑵𝒂𝒎𝒆: ${name}\n` +
          `» 🆔 _⁠-𝑼𝒊𝒅: ${senderID}\n` +
          `» ⏰ _⁠-𝑻𝒊𝒎𝒆: ${time}\n` +
          "» ⚙️ _⁠-𝑨𝒄𝒕𝒊𝒐𝒏 𝑩𝒚: 𝑩𝒐𝒕 𝑺𝒆𝒄𝒖𝒓𝒊𝒕𝒚 🚫\n" +
          "───────────────\n" +
          "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕";

        await message.reply(warningMsg);

        // ৬️⃣ সাধারণ ইউজারকে চ্যাট থেকে কিক করা
        api.removeUserFromGroup(senderID, threadID, (err) => {
          if (err) {
            message.reply(
              "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
              "───────────────\n" +
              "» ❌ ইউজারকে কিক করা সম্ভব হয়নি!\n" +
              "» 💡 দয়া করে বটকে গ্রুপের এডমিন (Admin) পাওয়ার দিন।\n" +
              "───────────────\n" +
              "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
            );
          }
        });

      } catch (err) {
        console.error("[AntiOutlink Error]:", err);
      }
    }
  }
};
