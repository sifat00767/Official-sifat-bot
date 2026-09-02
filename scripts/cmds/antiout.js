const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "antiout",
    version: "2.7.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Auto re-adds members who leave the group",
      bn: "গ্রুপ থেকে কেউ লিভ নিলে তাকে অটো রি-এড করে"
    },
    longDescription: {
      en: "Automatically adds back members who leave the group. Re-add status is saved permanently in database.",
      bn: "কেউ লিভ নিলে সাথে সাথে আবার গ্রুপে এড করে দেবে। বট রিস্টার্ট বা অফ হলেও ডাটাবেসে সেভ থাকবে।"
    },
    category: "events",
    guide: {
      en: "{p}antiout [on/off]\n{p}antiout [on/off] all (Only Bot Admin)\n{p}antiout [অন/অফ]\n{p}antiout [অন/অফ] অল (শুধুমাত্র বট এডমিন)"
    }
  },

  languages: {
    vi: {},
    en: {},
    bn: {}
  },

  onStart: async function ({ api, event, args, role, threadsData, message }) {
    const threadID = event.threadID;

    if (!args[0]) {
      return message.reply(
        "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
        "───────────────\n" +
        "» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n" +
        "» 📌 /antiout on / off\n" +
        "» 📌 /antiout অন / অফ\n" +
        "» 📌 /antiout on all (Bot Admin)\n" +
        "» 📌 /antiout অন অল (Bot Admin)\n" +
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
            await threadsData.set(thread.threadID, true, "data.antioutStatus");
          }
          return message.reply(
            "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
            "───────────────\n" +
            "» 🛡️ _⁠-𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝑨𝒍𝒍 𝑬𝒏𝒂𝒃𝒍𝒆𝒅\n" +
            "» 🚀 বটের সমস্ত গ্রুপে অ্যান্টিআউট সার্ভিস অন করা হলো!\n" +
            "───────────────\n" +
            "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
          );
        } else if (subCommand === "off" || subCommand === "অফ") {
          const allThreads = await threadsData.getAll();
          for (const thread of allThreads) {
            await threadsData.set(thread.threadID, false, "data.antioutStatus");
          }
          return message.reply(
            "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
            "───────────────\n" +
            "» 🔓 _⁠-𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝑨𝒍𝒍 𝑫𝒊𝒔𝒂𝒃𝒍𝒆𝒅\n" +
            "» 🚫 বটের সমস্ত গ্রুপে অ্যান্টিআউট সার্ভিস অফ করা হলো!\n" +
            "───────────────\n" +
            "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
          );
        }
      }

      // Specific Thread Toggle (Only for current thread)
      if (subCommand === "on" || subCommand === "অন") {
        await threadsData.set(threadID, true, "data.antioutStatus");
        return message.reply(
          "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
          "───────────────\n" +
          "» 🛡️ _⁠-𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝑬𝒏𝒂𝒃𝒍𝒆𝒅\n" +
          "» ✨ এই গ্রুপের জন্য অ্যান্টিআউট সার্ভিস অন করা হয়েছে!\n" +
          "───────────────\n" +
          "» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕"
        );
      } else if (subCommand === "off" || subCommand === "অফ") {
        await threadsData.set(threadID, false, "data.antioutStatus");
        return message.reply(
          "» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n" +
          "───────────────\n" +
          "» 🔓 _⁠-𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝑫𝒊𝒔𝒂𝒃𝒍𝒆𝒅\n" +
          "» 🚫 এই গ্রুপের জন্য অ্যান্টিআউট সার্ভিস অফ করা হয়েছে!\n" +
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

  onEvent: async function ({ api, event, usersData, threadsData }) {
    if (event.logMessageType === "log:unsubscribe") {
      const { threadID, logMessageData } = event;
      const leftUserID = logMessageData.leftParticipantFbId;

      // Strict Antiout Status Check (ডাটাবেস থেকে অন কিনা চেক করবে)
      const antioutStatus = await threadsData.get(threadID, "data.antioutStatus");
      if (antioutStatus !== true) return;

      // বট নিজে লিভ নিলে কাজ করবে না
      if (leftUserID === api.getCurrentUserID()) return;

      const name = await usersData.getName(leftUserID);

      // ডাটাবেস থেকে ইউজারদের Re-add ট্র্যাকিং হিস্ট্রি নেওয়া
      const readdList = (await threadsData.get(threadID, "data.antioutReaddList")) || [];

      // ২য় বার লিভ নিয়েছে কিনা ডাটাবেস চেক
      if (readdList.includes(leftUserID)) {
        api.sendMessage(
          `» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n` +
          `───────────────\n` +
          `» 🖐️ 𝑮𝒐𝒐𝒅𝒃𝒚𝒆 ${name} !\n` +
          `» ⚠️ আপনি আগেও একবার লিভ নিয়েছিলেন এবং আপনাকে ব্যাক আনা হয়েছিল।\n` +
          `» 🚫 যেহেতু আবারও লিভ নিয়েছেন, আপনাকে আর এই গ্রুপে রি-এড করা হবে না। ভালো থাকবেন!\n` +
          `───────────────\n` +
          `» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`,
          threadID
        );
        return;
      }

      // ১ম বার লিভ নিলে অটো রি-এড এবং ডাটাবেসে সেভ
      try {
        await api.addUserToGroup(leftUserID, threadID);

        // ডাটাবেসে ইউজারের আইডি যুক্ত করে সেভ করা (যাতে বট অফ হলেও ডাটা থাকে)
        readdList.push(leftUserID);
        await threadsData.set(threadID, readdList, "data.antioutReaddList");

        api.sendMessage(
          `» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n` +
          `───────────────\n` +
          `» ⚠️ 𝑨𝒏𝒕𝒊𝒐𝒖𝒕 𝑨𝒍𝒆𝒓𝒕 !\n` +
          `» 📌 ${name} গ্রুপ থেকে লিভ নেওয়ার চেষ্টা করেছিলেন।\n` +
          `» 🛡️ অ্যান্টিআউট অন থাকায় আপনাকে পুনরায় এড করে দেওয়া হলো!\n` +
          `───────────────\n` +
          `» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`,
          threadID
        );
      } catch (e) {
        console.error("Antiout Re-add Error:", e);
      }
    }
  }
};
