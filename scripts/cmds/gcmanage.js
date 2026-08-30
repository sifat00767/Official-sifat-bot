const fs = require("fs");

module.exports = {
  config: {
    name: "gcmanage",
    aliases: ["gc", "group", "গ্রুপ"],
    version: "7.0",
    author: "SIYAM",
    role: 2, // ওনার/এডমিন অনলি
    category: "admin",
    shortDescription: "স্মার্ট গ্রুপ নোটিশ ও প্রফেশনাল লিভ সিস্টেম"
  },

  onStart: async function ({ message, args, api, event }) {
    const input = args.join(" ").toLowerCase().trim();
    global.GoatBot.onReply = global.GoatBot.onReply || new Map();

    if (input === "list" || input === "লিস্ট") {
      try {
        const inbox = await api.getThreadList(100, null, ["INBOX"]);
        const groups = inbox.filter(t => t.isGroup);
        if (groups.length === 0) return message.reply("⚠️ বটের কোনো একটিভ গ্রুপ চ্যাট পাওয়া যায়নি।");

        let msg = "✨ 🌐 𝐁𝐎𝐓 𝐀𝐂𝐓𝐈𝐕𝐄 𝐂𝐇𝐀𝐍𝐍𝐄𝐋𝐒 🌐 ✨\n━━━━━━━━━━━━━━━━━━\n", reps = [];
        groups.forEach((g, i) => {
          msg += `[ ${i + 1} ] 👥 ${g.name || "Unnamed Group"}\n🆔 𝖨𝖣: ${g.threadID}\n━━━━━━━━━━━━━━━━━━\n`;
          reps.push({ num: i + 1, id: g.threadID, name: g.name || "Unnamed Group" });
        });
        msg += `\n⚡ 𝖦𝖴𝖨𝖣𝖤𝖫𝖨𝖭𝖤:\n» লিভ ও নোটিশ দিতে লিখুন: "out <নাম্বার>"\n» গ্রুপে জয়েন হতে লিখুন: "add <নাম্বার>"\n(এই মেসেজে রিপ্লাই দিন)`;

        return message.reply(msg, (e, info) => {
          if (!e) {
            global.GoatBot.onReply.set(info.messageID, { 
              commandName: "gcmanage", 
              author: event.senderID, 
              data: reps,
              msgIds: [info.messageID, event.messageID] // ইনিশিয়াল মেসেজ এবং ইউজারের কমান্ড ট্র্যাক
            });
          }
        });
      } catch (e) { return message.reply("❌ এরর: " + e.message); }
    }
    return message.reply("💡 ব্যবহার করতে লিখুন: gc list অথবা gc লিস্ট");
  },

  onReply: async function ({ message, Reply, event, api }) {
    if (event.senderID !== Reply.author) return;
    const text = event.body.trim().toLowerCase();
    const cmdChannel = event.threadID;

    // আগের জমানো মেসেজ আইডি রিকভার করা বা নতুন অ্যারে নেওয়া
    let trackedIds = Reply.msgIds || [];
    trackedIds.push(event.messageID); // বর্তমান ইউজারের রিপ্লাই আইডি পুশ করা হলো

    // গ্লোবাল ডিলিট ফাংশন (যেকোনো স্টেজে সব জমানো মেসেজ এক ক্লিকে রিমুভ করবে)
    const cleanupMessages = async (idsArray) => {
      if (idsArray && idsArray.length > 0) {
        // ডুপ্লিকেট আইডি রিমুভ করা
        const uniqueIds = [...new Set(idsArray)];
        for (const id of uniqueIds) {
          try { await api.unsendMessage(id); } catch(e){}
        }
      }
    };

    // ================= [ ADD FEATURE ] =================
    if (text.startsWith("add")) {
      const num = parseInt(text.replace("add", "").trim());
      if (isNaN(num)) return message.reply("❌ অনুগ্রহ করে সঠিক নাম্বার টাইপ করুন। (উদা: add 1)");

      const target = Reply.data.find(g => g.num === num);
      if (!target) return message.reply("❌ এই নাম্বারের কোনো গ্রুপ খুঁজে পাওয়া যায়নি।");

      try {
        await api.addUserToGroup(event.senderID, target.id);
        message.reply(`✅ আপনাকে সফলভাবে "${target.name}" গ্রুপে যুক্ত করা হয়েছে।`);
        await cleanupMessages(trackedIds);
      } catch (err) {
        return message.reply(`❌ গ্রুপে অ্যাড করা যায়নি। হতে পারে গ্রুপের মেম্বার ফুল বা বটের পারমিশন নেই।`);
      }
      return;
    }

    // ================= [ OUT FEATURE ] =================
    if (text.startsWith("out")) {
      const num = parseInt(text.replace("out", "").trim());
      if (isNaN(num)) return message.reply("❌ অনুগ্রহ করে সঠিক নাম্বার টাইপ করুন। (উদা: out 1)");

      // এখানে অবজেক্ট ক্লোনিং করে টার্গেটের ডেটা সুরক্ষিত করা হয়েছে
      const target = Reply.data.find(g => g.num === num);
      if (!target) return message.reply("❌ এই নাম্বারের কোনো গ্রুপ খুঁজে পাওয়া যায়নি।");
      
      try {
        const currentThread = await api.getThreadInfo(cmdChannel);
        const currentName = currentThread.threadName || "Админ Снαииєℓ";
        const targetName = target.name;
        const targetId = target.id;

        // নোটিশ প্রসেসিং মেসেজ পাঠানো এবং সেটির আইডিও ট্র্যাকিং লিস্টে রাখা
        api.sendMessage(`⏳ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂... "${targetName}" গ্রুপে মডার্ন নোটিশ পাঠানো হচ্ছে।`, cmdChannel, async (err, procInfo) => {
          if (!err) trackedIds.push(procInfo.messageID);
        });

        // ১ নম্বর নোটিশ (টার্গেট গ্রুপে) - অফিশিয়াল নোটিশ ডিজাইন
        const noticeMsg = `👑𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗡𝗢𝗧𝗜𝗖𝗘⏳\n` +
          `──────────────────\n` +
          `🤲 আসসালামু আলাইকুম।\n\n` +
          `📢 "${targetName}" গ্রুপটি\n` +
          `আগামী ৩ মিনিটের মধ্যে ব্যান করা হবে।\n\n` +
          `📌 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗦𝗼𝘂𝗿𝗰𝗲\n` +
          `💬 এই নোটিশটি "${currentName}"\n` +
          `গ্রুপ থেকে ওনার দ্বারা পাঠানো হয়েছে।\n\n` +
          `📞 বটটি পুনরায় ব্যবহার করতে\n` +
          `নিচের অফিসিয়াল নাম্বারে যোগাযোগ করুন।\n\n` +
          `──────────────────\n` +
          `☎️ 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 : +88017891\n` +
          `✨ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃\n\n` +
          `──────────────────\n` +
          `_⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;
        
        await api.sendMessage(noticeMsg, targetId);

        // ওনারের গ্রুপে পারমিশন মেসেজ পাঠানো - লিভ কনফার্ম ডিজাইন
        const askMsg = `👑𝗟𝗘𝗔𝗩𝗘 𝗖𝗢𝗡𝗙𝗜𝗥𝗠💲\n` +
          `──────────────────\n` +
          `🔔 সিফাত বস, লিভ বেন করবো?\n\n` +
          `🎯 𝗧𝗮𝗿𝗴𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 : "${targetName}"\n\n` +
          `✅  𝗥𝗲𝗽𝗹𝘆 : "ass" (Confirm)</b>\n` +
          `❌  𝗥𝗲𝗽𝗹𝘆 : "no" (Cancel)</b>\n\n` +
          `⏳ 𝗧𝗶𝗺𝗲𝗼𝘂𝘁 : আপনি সিলেক্ট না করা পর্যন্ত বট বেন করবে না\n\n` +
          `──────────────────\n` +
          `_⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;

        // আগের ইভেন্ট ডিলিট করে নতুন চেইনে সম্পূর্ণ ডেটা ট্রান্সফার
        global.GoatBot.onReply.delete(event.messageReply.messageID);

        api.sendMessage(askMsg, cmdChannel, (err, info) => {
          if (!err) {
            trackedIds.push(info.messageID); // এই পারমিশন মেসেজ আইডিও পুশ হলো
            
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "gcmanage",
              author: Reply.author,
              action: "confirm_leave",
              msgIds: trackedIds, // আগের সব আইডি এখানে পাস হলো
              targetName: targetName,
              targetId: targetId,
              currentName: currentName
            });
          }
        });

      } catch (e) {
        return message.reply(`❌ অপারেশন ব্যর্থ! টার্গেট গ্রুপে মেসেজ ব্লক অথবা বটকে মিউট করা হয়েছে।`);
      }
      return;
    }

    // ================= [ CONFIRMATION HANDLER ] =================
    if (Reply.action === "confirm_leave") {
      const targetName = Reply.targetName;
      const targetId = Reply.targetId;
      const currentName = Reply.currentName;

      // যদি ওনার "ass" লেখে (লিভ কনফার্ম)
      if (text === "ass") {
        // লোডিং মেসেজ পাঠানো এবং ট্র্যাকিং লিস্টে এড করা
        api.sendMessage(`⏳ 𝖫𝗈𝖺𝖽𝗂𝗇𝗀... প্রসেস চূড়ান্ত করা হয়েছে। ঠিক ৩ মিনিট পর বিদায় মেসেজ দিয়ে বট লিভ নিবে...`, cmdChannel, async (err, loadInfo) => {
          if (!err) trackedIds.push(loadInfo.messageID);
        });
        
        global.GoatBot.onReply.delete(event.messageReply.messageID); // ডুপ্লিকেট রোধ

        // ৩ মিনিট (১৮০,০০০ মিলিসেকেন্ড) পর রান হবে সম্পূর্ণ লিভ প্রসেস
        setTimeout(async () => {
          try {
            // ১. ৩ মিনিট শেষ হওয়ার সাথে সাথে প্রথমে টার্গেট গ্রুপে বিদায় মেসেজ পাঠানো হবে
            const leaveMsg = `🔰𝗦𝗬𝗦𝗧𝗘𝗠 𝗟𝗘𝗔𝗩𝗜𝗡𝗚 🔱\n` +
              `──────────────────\n` +
              `🚨 𝗟𝗲𝗮𝘃𝗶𝗻𝗴 𝗚𝗿𝗼𝘂𝗽...\n\n` +
              `👋 এই গ্রুপ থেকে লিভ নেওয়া হয়েছে।\n` +
              `👑 এডমিন সরাসরি "${targetName}" গ্রুপটিকে\n` +
              `ব্যান লিস্টে যুক্ত করেছেন \n\n` +
              `🎈 আমাকে ব্যবহার করার জন্য ধন্যবাদ।\n` +
              `𝗚𝗼𝗼𝗱𝗯𝘆𝗲..👋!\n\n` +
              `──────────────────\n` +
              `_⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;
            
            await api.sendMessage(leaveMsg, targetId);

            // ২. বিদায় মেসেজ যাওয়ার পর পরই গ্রুপ থেকে লিভ নিবে
            await api.removeUserFromGroup(api.getCurrentUserID(), targetId);
            
            // ৩. মূল ওনার গ্রুপে সাকসেস মেসেজ পাঠানো
            const successMsg = `✨𝗧𝗔𝗦𝗞 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗✨\n` +
              `──────────────────\n` +
              `🚀 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗘𝘅𝗲𝗰𝘂𝘁𝗲𝗱!\n\n` +
              `🎯 𝗧𝗮𝗿𝗴𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 : "${targetName}"\n` +
              `📡 𝗦𝗲𝗻𝗱 𝗚𝗿𝗼𝘂𝗽 : "${currentName}"\n\n` +
              `📊 স্ট্যাটাস: বট সফলভাবে লিভ নিয়েছে এবং\n` +
              `আগের সব মেসেজ রিমুভ করা হচ্ছে!\n\n` +
              `──────────────────\n` +
              `_⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;
            
            await api.sendMessage(successMsg, cmdChannel);
            
            // ৪. সব ফালতু বা প্রসেসিং মেসেজ এক ক্লিকে ডিলিট করা
            await cleanupMessages(trackedIds);

          } catch (err) {
            return api.sendMessage(`❌ "${targetName}" গ্রুপে লিভ প্রসেস সফল করা যায়নি বা বট অলরেডি রিমুভড।`, cmdChannel);
          }
        }, 180000); // ঠিক ১৮০,০০০ মিলিসেকেন্ড বা ৩ মিনিট টাইমার
      } 
      // যদি ওনার "no" লেখে (লিভ বাতিল)
      else if (text === "no") {
        global.GoatBot.onReply.delete(event.messageReply.messageID);

        try {
          // টার্গেট গ্রুপে মেসেজ পাঠানো
          await api.sendMessage(`❌ সিয়াম বস এই গ্রুপ থেকে বটের লিভ নিতে নিষেধ করেছেন। আপনাদের গ্রুপটি আনব্যান আছে।`, targetId);
          
          // মূল গ্রুপে মেসেজ
          await api.sendMessage(`❌ বস লিভ নিতে নিষেধ করছে! অপারেশন বাতিল করা হলো..⏳।`, cmdChannel);
          
          // প্রসেস বাতিল হলেও সব ফালতু মেসেজ ক্লিনআপ হবে
          await cleanupMessages(trackedIds);

        } catch (e) {
          return api.sendMessage(`❌ প্রসেস বাতিল করার সময় কিছু সমস্যা হয়েছে।`, cmdChannel);
        }
      } else {
        return message.reply(`❌ ভুল অপশন! অনুগ্রহ করে সঠিক গাইডলাইন মেনে শুধু "ass" অথবা "no" লিখে রিপ্লাই দিন।`);
      }
    }
  }
};
