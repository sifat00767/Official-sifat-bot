const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "hack",
    version: "6.0.0",
    author: "SIYAM HASAN",
    countDown: 8,
    role: 0,
    shortDescription: "Hyper-Realistic Cyber Attack Simulator",
    longDescription: "Executes a highly convincing and terrifying social engineering hack simulation with structural safety.",
    category: "fun",
    guide: {
      en: "{pn} @mention অথবা reply দিন"
    }
  },

  onStart: async function ({ event, message, usersData, api }) {
    const { type, messageReply, mentions, senderID } = event;
    
    // ১. টার্গেট আইডি একদম নিখুঁতভাবে ফিল্টার করা
    let targetID = senderID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    }

    // বটের নিজের আইডি হলে প্রসেস স্কিপ করা (ক্র্যাশ এড়াতে)
    if (targetID == api.getCurrentUserID()) {
      return message.reply("❌ নিজের বটের উপর সাইবার অ্যাটাক চালানো সম্ভব নয়!");
    }

    // ইউনিক ফাইল পাথ তৈরি (যাতে একের অধিক ইউজার একসাথে কমান্ড দিলে ক্র্যাশ না করে)
    const cacheDir = path.join(__dirname, "cache");
    const avatarPath = path.join(cacheDir, `target_avt_${targetID}.png`);
    
    let procMessage;
    
    try {
      // ফোল্ডার না থাকলে তৈরি করা
      await fs.ensureDir(cacheDir);

      // ফেসবুক সার্ভার থেকে টার্গেটের একদম রিয়েল নাম সংগ্রহ
      const userName = await usersData.getName(targetID);

      // ⏳ সাইবার টার্মিনাল ফেক প্রসেস লগস (ভয়ংকর ইন্টারফেস)
      procMessage = await message.reply(`⚡ [INJECTING EXPLOIT]...\n════════════════════\n🎯 Target Name: ${userName}\n🎯 UID: ${targetID}\n🤖 সিস্টেম হ্যাকিং স্ক্রিপ্ট রান করা হচ্ছে...`);
      
      setTimeout(async () => {
        await api.editMessage(`🎚️ [MS-FRAMEWORK] ➔ টার্গেটের ডিভাইসের লোকাল আইপি আইডেন্টিফাই করা হচ্ছে...\n📡 IP Address: ${Math.floor(Math.random() * 160) + 20}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 90)}.${Math.floor(Math.random() * 254)}`, procMessage.messageID).catch(() => {});
      }, 2500);

      setTimeout(async () => {
        await api.editMessage(`🔓 [SECURITY BREACH] ➔ মেটা-ডাটা ডাটাবেজ ক্র্যাক করা হয়েছে! ফেসবুক আইডির রিয়েল পাসওয়ার্ড হ্যাশ টোকেন সাকসেসফুলি বাইপাস হচ্ছে...`, procMessage.messageID).catch(() => {});
      }, 5000);

      setTimeout(async () => {
        await api.editMessage(`📥 [CHATS EXTRACTION] ➔ আপনার ফেসবুক আইডির সমস্ত সিক্রেট ইনবক্স চ্যাট, কল হিস্ট্রি এবং ডিলিট করা মেসেজ ব্যাকআপ নেওয়া হচ্ছে...`, procMessage.messageID).catch(() => {});
      }, 7500);

      setTimeout(async () => {
        await api.editMessage(`📸 [STEALING MEDIA] ➔ রুট পারমিশন গ্র্যান্টেড! ফোনের ইন্টারনাল স্টোরেজ থেকে সমস্ত পার্সোনাল এবং প্রাইভেট ছবি ক্লাউড হোস্টে আপলোড করা হচ্ছে...`, procMessage.messageID).catch(() => {});
      }, 10000);

      setTimeout(async () => {
        await api.editMessage(`⚙️ [FINALIZING] ➔ হ্যাকিং প্রসেস ১০০% কমপ্লিট! সমস্ত লিক হওয়া ডেটা সায়াম বসের মেইনফ্রেমে ট্রান্সফার করা হচ্ছে...`, procMessage.messageID).catch(() => {});
      }, 12500);


      // ২. টার্গেটের রিয়েল প্রোফাইল ছবি হাই-কোয়ালিটিতে সরাসরি ফেসবুক সার্ভার থেকে নামানো
      const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=500&height=500&access_token=${fbToken}`;
      
      const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      await fs.writeFile(avatarPath, Buffer.from(response.data, "utf-8"));

      // র্যান্ডম ফাইল এবং ফ্রেন্ড কাউন্ট জেনারেট (রিয়েল ভাইব দিতে)
      const totalFriends = Math.floor(Math.random() * (4850 - 620 + 1)) + 620;
      const totalMedia = Math.floor(Math.random() * (2200 - 150 + 1)) + 150;

      // ৩. চূড়ান্ত মাস্টার থ্রেট রিপোর্ট মেসেজ
      let finalReport = `☠️ 𝐂𝐘𝐁𝐄𝐑 𝐀𝐓𝐓𝐀𝐂𝐊 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋 ☠️\n`;
      finalReport += `═══════════════\n\n`;
      finalReport += `👤 নাম ➦ ${userName}\n`;
      finalReport += `🆔 আইডি ➦ ${targetID}\n`;
      finalReport += `👥 ফ্রেন্ডস ➦ ${totalFriends} জন\n`;
      finalReport += `🌐 লিংক ➦ https://www.facebook.com/${targetID}\n\n`;
      finalReport += `━━━━━━━━━━━━━━━\n`;
      finalReport += `📊 [𝗘𝗫𝗧𝗥𝗔𝗖𝗧𝗘𝗗 𝗟𝗢𝗚𝗦 𝗦𝗨𝗠𝗠𝗔𝗥𝗬]\n`;
      finalReport += `━━━━━━━━━━━━━━━\n\n`;
      finalReport += `🔓 ফেসবুক আইডির পাসওয়ার্ড এবং টু-ফ্যাক্টর প্রোটোকল বাইপাস করা হয়েছে।\n`;
      finalReport += `💬 মেসেঞ্জারের ইনবক্সের সমস্ত গোপন চ্যাট মেসেজ ব্যাকআপ নেওয়া হয়েছে।\n`;
      finalReport += `📸 গ্যালারি এক্সেস করে ${totalMedia}টি প্রাইভেট ফটো ও ভিডিও ডাউনলোড করা হয়েছে।\n\n`;
      finalReport += `━━━━━━━━━━━━━━━\n`;
      finalReport += `𝗠𝗔𝗜𝗡𝗙𝗥𝗔𝗠𝗘 𝗦𝗘𝗥𝗩𝗘𝗥\n`;
      finalReport += `━━━━━━━━━━━━━━━\n\n`;
      finalReport += `🔥 আপনার জীবন ও আইডির সমস্ত গোপন ডাটা এখন "সিয়াম বস"-এর কন্ট্রোলে চলে গেছে।\n\n`;
      finalReport += `⚠️ আগামী ৫ মিনিটের মধ্যে আপনার ডিভাইস থেকে এই ফেসবুক আইডি অটোমেটিক লগআউট হয়ে যাবে এবং সিকিউরিটি অ্যালার্টের কারণে অ্যাকাউন্টটি চিরতরে ডিসেবল হয়ে যাবে!`;

      // মূল মেসেজ পাঠানো এবং লোডিং মেসেজ ডিলিট করা
      setTimeout(async () => {
        try {
          if (procMessage && procMessage.messageID) {
            await api.unsendMessage(procMessage.messageID);
          }
        } catch (e) {}

        // টার্গেটের আসল প্রোফাইল পিকচার সহ ফাইনাল মেসেজ পাঠানো
        await message.reply({
          body: finalReport,
          attachment: fs.createReadStream(avatarPath)
        });

        // ক্র্যাশ বা মেমোরি ফুল হওয়া আটকাতে ক্যাশ ফাইল সাথে সাথে ডিলিট
        if (await fs.pathExists(avatarPath)) {
          await fs.unlink(avatarPath);
        }
      }, 15000); // ১৫ সেকেন্ডের পারফেক্ট টার্মিনাল এক্সিকিউশন টাইম

    } catch (error) {
      console.error("Hack Command Error:", error);
      // কোনো কারণে প্রসেস ফেইল হলে ক্যাশ ক্লিন করা এবং বট সেফ রাখা
      if (await fs.pathExists(avatarPath)) {
        await fs.unlink(avatarPath);
      }
      try {
        if (procMessage && procMessage.messageID) await api.unsendMessage(procMessage.messageID);
      } catch (e) {}
      
      message.reply("❌ টার্গেট সার্ভার হাই-সিকিউরড ক্লাউড ফায়ারওয়াল ব্যবহার করায় বা টোকেন এক্সপায়ারড হওয়ায় হ্যাকিং অপারেশন ব্যর্থ হয়েছে!");
    }
  }
};
