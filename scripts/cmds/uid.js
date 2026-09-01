const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uid",
    version: "2.0.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Get user UID with a compact premium thumbnail",
      bn: "ছোট ও প্রিমিয়াম থাম্বনেইল সহ ইউআইডি দেখুন"
    },
    longDescription: {
      en: "Generates a sleek, high-quality mini card displaying profile picture, name, and UID with Sifat Sir branding.",
      bn: "ইউজারের প্রোফাইল পিকচার, নাম এবং ইউআইডি সহ ছোট ও আকর্ষণীয় কার্ড তৈরি করে।"
    },
    category: "info",
    guide: {
      en: "{p}uid or {p}uid @mention",
      bn: "{p}uid অথবা {p}uid @মেনশন"
    }
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    try {
      let targetID = event.senderID;

      if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      }

      const userName = await usersData.getName(targetID);
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // স্লিম ও ছোট ক্যানভাস (500x180)
      const canvas = createCanvas(500, 180);
      const ctx = canvas.getContext("2d");

      // প্রিমিয়াম মেটালিক পারপল-ব্লু গ্রেডিয়েন্ট
      const gradient = ctx.createLinearGradient(0, 0, 500, 180);
      gradient.addColorStop(0, "#0f0c29");
      gradient.addColorStop(0.5, "#302b63");
      gradient.addColorStop(1, "#24243e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 500, 180);

      // নিওন সাইড বর্ডার ও গ্লো লাইন
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, 488, 168);

      // গ্লোয়িং স্টাইলিশ ট্রিম লাইন
      ctx.strokeStyle = "#4facfe";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 480, 160);

      // প্রোফাইল পিকচার (সার্কেল শেপ + নিওন রিং)
      try {
        const avatarImage = await loadImage(avatarUrl);
        ctx.save();
        ctx.beginPath();
        ctx.arc(75, 90, 45, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, 30, 45, 90, 90);
        ctx.restore();

        // পিকচারের চারপাশের উজ্জ্বল নিওন রিং
        ctx.beginPath();
        ctx.arc(75, 90, 47, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } catch (e) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(30, 45, 90, 90);
      }

      // ছোট এডমিন ব্র্যান্ডিং টেক্সট (উপরে ডান কোনায়)
      ctx.fillStyle = "#ff758c";
      ctx.font = "italic bold 13px sans-serif";
      ctx.fillText("» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡", 145, 38);

      // নাম (বোল্ড টেক্সট)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      const displayName = userName.length > 20 ? userName.substring(0, 20) + "..." : userName;
      ctx.fillText(`NAME  :  ${displayName}`, 145, 80);

      // ইউআইডি (হাইলাইটেড কালার)
      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText(`UID      :  ${targetID}`, 145, 118);

      // বট ডেকোরেশন লাইন
      ctx.fillStyle = "#ff758c";
      ctx.fillRect(145, 133, 310, 2);

      // ক্যাশে ফাইল সেভ
      const cachePath = path.join(__dirname, `cache/uid_${targetID}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));
      
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cachePath, buffer);

      // মেসেজ ডেলিভারি
      return message.reply(
        {
          body: `» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n───────────────\n📌 ${userName}-এর ইউআইডি কার্ড প্রস্তুত!\n───────────────\n» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`,
          attachment: fs.createReadStream(cachePath)
        },
        () => {
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }
      );

    } catch (error) {
      console.error(error);
      return message.reply(`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n───────────────\n⚠️ ইউআইডি কার্ড তৈরিতে সমস্যা হয়েছে!\n───────────────\n» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`);
    }
  }
};
