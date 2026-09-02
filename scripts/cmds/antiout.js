const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "antiout",
    version: "3.0.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Auto re-adds members who leave the group",
      bn: "গ্রুপ থেকে কেউ লিভ নিলে তাকে অটো রি-এড করে"
    },
    longDescription: {
      en: "Automatically adds back members who leave the group. Stored permanently in local DB.",
      bn: "কেউ লিভ নিলে সাথে সাথে আবার গ্রুপে এড করে দেবে। বট রিস্টার্ট নিলেও অফ হবে না।"
    },
    category: "events",
    guide: {
      en: "{p}antiout [on/off]\n{p}antiout [on/off] all (Only Bot Admin)"
    }
  },

  onStart: async function ({ api, event, args, role, threadsData, message }) {
    const threadID = event.threadID;

    if (!args[0]) {
      return message.reply(
        "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
        "───────────────\n" +
        "» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n" +
        "» 📌 /antiout on / off\n" +
        "» 📌 /antiout on all (Bot Admin)\n" +
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
          settings.antioutStatus = status;
          await threadsData.set(thread.threadID, settings, "settings");
        }

        return message.reply(`» 🛡️ বটের সমস্ত গ্রুপে অ্যান্টিআউট সার্ভিস ${status ? "অন" : "অফ"} করা হলো!`);
      }

      let settings = (await threadsData.get(threadID, "settings")) || {};

      if (subCommand === "on" || subCommand === "অন") {
        settings.antioutStatus = true;
        await threadsData.set(threadID, settings, "settings");
        return message.reply("» ✨ এই গ্রুপের জন্য অ্যান্টিআউট সার্ভিস অন করা হয়েছে (ডাটাবেসে সেভড)!");
      } else if (subCommand === "off" || subCommand === "অফ") {
        settings.antioutStatus = false;
        await threadsData.set(threadID, settings, "settings");
        return message.reply("» 🚫 এই গ্রুপের জন্য অ্যান্টিআউট সার্ভিস অফ করা হয়েছে!");
      }
    } catch (err) {
      return message.reply(`» ❌ এরর: ${err.message}`);
    }
  },

  onEvent: async function ({ api, event, usersData, threadsData }) {
    if (event.logMessageType === "log:unsubscribe") {
      const { threadID, logMessageData } = event;
      const leftUserID = logMessageData.leftParticipantFbId;

      const settings = (await threadsData.get(threadID, "settings")) || {};
      
      // Strict Permanent Settings Check
      if (settings.antioutStatus !== true) return;
      if (leftUserID === api.getCurrentUserID()) return;

      const name = await usersData.getName(leftUserID);
      const data = (await threadsData.get(threadID, "data")) || {};
      const readdList = data.antioutReaddList || [];

      if (readdList.includes(leftUserID)) {
        return api.sendMessage(
          `» 🖐️ 𝑮𝒐𝒐𝒅𝒃𝒚𝒆 ${name} !\n» 🚫 আপনি দ্বিতীয়বার লিভ নিয়েছেন, তাই আর রি-এড করা হলো না।`,
          threadID
        );
      }

      try {
        await api.addUserToGroup(leftUserID, threadID);
        readdList.push(leftUserID);
        data.antioutReaddList = readdList;
        await threadsData.set(threadID, data, "data");

        api.sendMessage(
          `» ⚠️ 𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝑨𝒍𝒆𝒓𝒕 !\n» 📌 ${name} গ্রুপ থেকে লিভ নেওয়ার চেষ্টা করেছিলেন। অটো এড দেওয়া হলো!`,
          threadID
        );
      } catch (e) {
        console.error("Antiout Re-add Error:", e);
      }
    }
  }
};
