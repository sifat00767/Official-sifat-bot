const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "uid",
    version: "4.0.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "Get user UID with a sleek mini hexagon card",
      bn: "ছোট হেক্সাগন থাম্বনেইল সহ ইউআইডি দেখুন"
    },
    longDescription: {
      en: "Generates a compact, high-quality mini card with a unique hexagon profile picture and subtle branding.",
      bn: "ইউনিক হেক্সাগন প্রোফাইল শেপ ও সূক্ষ্ম ব্র্যান্ডিং সহ ছোট কার্ড তৈরি করে।"
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

      // ছোট ও স্লিম ক্যানভাস সাইজ (450x150)
      const canvas = createCanvas(450, 150);
      const ctx = canvas.getContext("2d");

      ctx.antialias = "subpixel";

      // উন্নত সাইবার-ডার্ক ওশান গ্রেডিয়েন্ট
      const gradient = ctx.createLinearGradient(0, 0, 450, 150);
      gradient.addColorStop(0, "#09090e");
      gradient.addColorStop(0.5, "#111625");
      gradient.addColorStop(1, "#09101d");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 450, 150);

      // নিওন সাইড গ্রাফিক্স বর্ডার
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, 438, 138);

      ctx.strokeStyle = "#9d4edd";
      ctx.lineWidth = 1;
      ctx.strokeRect(9, 9, 432, 132);

      // হেক্সাগন (Hexagon) ড্র করার ফাংশন
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
        drawHexagon(75, 75, 42);
        ctx.clip();
        ctx.drawImage(avatarImage, 30, 30, 90, 90);
        ctx.restore();

        // হেক্সাগনের চারপাশে গ্লোয়িং নিওন বর্ডার
        drawHexagon(75, 75, 43);
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } catch (e) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(30, 30, 90, 90);
      }

      // নাম (বোল্ড টেক্সট)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      const displayName = userName.length > 20 ? userName.substring(0, 20) + "..." : userName;
      ctx.fillText(`NAME : ${displayName}`, 140, 50);

      // ইউআইডি (হাইলাইটেড নিওন কালার)
      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(`UID  : ${targetID}`, 140, 80);

      // সূক্ষ্ম ডিভাইডার লাইন
      ctx.fillStyle = "rgba(157, 78, 221, 0.4)";
      ctx.fillRect(140, 95, 270, 1);

      // ছোট ও মানানসই Powered by Sifat Ahmed
      ctx.fillStyle = "#6c757d";
      ctx.font = "italic 11px sans-serif";
      ctx.fillText("Powered by Sifat Ahmed", 140, 115);

      // ক্যাশে ফাইল সেভ
      const cachePath = path.join(__dirname, `cache/uid_${targetID}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cachePath, buffer);

      // কোনো বডি টেক্সট ছাড়া শুধু থাম্বনেইল পিকচার পাঠানো
      return message.reply(
        {
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
