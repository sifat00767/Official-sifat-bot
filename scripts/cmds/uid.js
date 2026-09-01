const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uid",
    version: "7.1.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Get user UID with a clean premium card",
      bn: "ক্লিন প্রিমিয়াম কার্ড সহ ইউআইডি দেখুন"
    },
    longDescription: {
      en: "Displays UID text message along with a clean premium styled image card.",
      bn: "মেসেজে ইউআইডি টেক্সট এবং সাথে ক্লিন প্রিমিয়াম ইমেজ কার্ড পাঠায়।"
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

      // ১. রিপ্লাই চেক
      if (event.type === "message_reply" && event.messageReply?.senderID) {
        targetID = event.messageReply.senderID;
      }
      // ২. মেনশন চেক
      else if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }

      // টার্গেট ইউজারের সঠিক নাম ফেচ করা
      let userName = "Facebook User";
      try {
        const userInfo = await usersData.get(targetID);
        userName = userInfo?.name || (await usersData.getName(targetID));
      } catch (e) {
        userName = "Facebook User";
      }

      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // ক্যানভাস সাইজ (550x200)
      const canvas = createCanvas(550, 200);
      const ctx = canvas.getContext("2d");

      ctx.antialias = "subpixel";

      // ডার্ক প্রিমিয়াম মেটালিক ব্যাকগ্রাউন্ড
      const bgGradient = ctx.createLinearGradient(0, 0, 550, 200);
      bgGradient.addColorStop(0, "#0a0b10");
      bgGradient.addColorStop(0.5, "#141622");
      bgGradient.addColorStop(1, "#0a0b10");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 550, 200);

      // নিওন সাইড বর্ডার
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, 534, 184);

      ctx.strokeStyle = "#7f00ff";
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, 526, 176);

      // হেক্সাগন ড্র করার ফাংশন
      function drawHexagon(x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + r * Math.cos(angle);
          const hy = y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
      }

      // প্রোফাইল পিকচার (হেক্সাগন ফ্রেমে ক্রপ করা)
      try {
        const avatarImage = await loadImage(avatarUrl);
        ctx.save();
        drawHexagon(95, 100, 55);
        ctx.clip();
        ctx.drawImage(avatarImage, 40, 45, 110, 110);
        ctx.restore();

        // হেক্সাগনের চারপাশে শার্প নিওন রিং
        drawHexagon(95, 100, 57);
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } catch (e) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(40, 45, 110, 110);
      }

      // ১. নাম
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      const displayName = userName.length > 18 ? userName.substring(0, 18) + "..." : userName;
      ctx.fillText(`NAME : ${displayName}`, 180, 65);

      // ২. ইউআইডি
      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`UID  : ${targetID}`, 180, 105);

      // ৩. ডিভাইডার লাইন
      ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
      ctx.fillRect(180, 123, 330, 1.5);

      // ৪. ব্র্যান্ডিং
      ctx.fillStyle = "#00f2fe";
      ctx.font = "italic bold 13px sans-serif";
      ctx.fillText("⚡powerd by : Sifat Ahmed", 180, 150);

      // ক্যাশে ফাইল সেভ
      const cachePath = path.join(__dirname, `cache/uid_${targetID}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cachePath, buffer);

      // চ্যাটে বডি মেসেজে সঠিক টার্গেট আইডি ও পিকচার যাবে
      return message.reply(
        {
          body: `UID: ${targetID}`,
          attachment: fs.createReadStream(cachePath)
        },
        () => {
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }
      );

    } catch (error) {
      console.error(error);
      return message.reply("⚠️ ইউআইডি কার্ড তৈরি করতে সমস্যা হয়েছে!");
    }
  }
};
