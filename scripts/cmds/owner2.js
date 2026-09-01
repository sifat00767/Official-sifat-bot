const { createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner2",
    aliases: [],
    version: "3.5.0",
    author: "𝐒𝐈𝐅𝐀𝐓",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Compact owner details thumbnail card"
    },
    longDescription: {
      en: "Generates a sleek compact image card containing owner details, uptime, commands, and prefix."
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const prefix = global.utils.getPrefix(event.threadID) || ".";
      const totalCommands = global.GoatBot?.commands?.size || 258;

      // বটের লাইভ আপটাইম
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // স্লিম এবং কম্প্যাক্ট ক্যানভাস সাইজ (560x300)
      const canvas = createCanvas(560, 300);
      const ctx = canvas.getContext("2d");

      ctx.antialias = "subpixel";

      // ডার্ক পারপল-ওশান মেটালিক ব্যাকগ্রাউন্ড
      const bgGradient = ctx.createLinearGradient(0, 0, 560, 300);
      bgGradient.addColorStop(0, "#090a16");
      bgGradient.addColorStop(0.5, "#121626");
      bgGradient.addColorStop(1, "#090a16");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 560, 300);

      // শার্প নিওন সাইড বর্ডার
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, 548, 288);

      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 1;
      ctx.strokeRect(9, 9, 542, 282);

      // লেফট কলাম: ওনার হেডার
      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("👑 OWNER INFO", 30, 35);

      // রাইট কলাম: সিস্টেম হেডার
      ctx.fillText("⚡ SYSTEM STATS", 310, 35);

      // ডিভাইডার লাইন
      ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
      ctx.fillRect(30, 45, 500, 1.5);

      // ওনার ডিটেইলস (লেফট সাইড)
      const ownerDetails = [
        ["Name", "Sifat Ahmed"],
        ["Gender", "Male"],
        ["Address", "Bogura"],
        ["Country", "Bangladesh"],
        ["Religion", "Islam"],
        ["Status", "Single"],
        ["Work", "Student"]
      ];

      let startY = 72;
      ownerDetails.forEach(([label, value]) => {
        ctx.fillStyle = "#00f2fe";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText(`${label}`, 30, startY);

        ctx.fillStyle = "#ffffff";
        ctx.font = "13px sans-serif";
        ctx.fillText(`: ${value}`, 105, startY);
        startY += 21;
      });

      // মিডল সেপারেটর লাইন
      ctx.fillStyle = "rgba(255, 0, 127, 0.3)";
      ctx.fillRect(290, 58, 1.5, 160);

      // সিস্টেম স্ট্যাটস (রাইট সাইড)
      const stats = [
        ["Uptime", uptimeString],
        ["Cmds", `${totalCommands}`],
        ["Prefix", `${prefix}`]
      ];

      let statsY = 75;
      stats.forEach(([label, value]) => {
        ctx.fillStyle = "#00f2fe";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText(`${label}`, 310, statsY);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText(`: ${value}`, 370, statsY);
        statsY += 28;
      });

      // বটম ডিভাইডার
      ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
      ctx.fillRect(30, 230, 500, 1);

      // এভেইলএবল কমান্ডস
      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("📌 CMDS :", 30, 255);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`${prefix}help  ${prefix}help2  ${prefix}owner  ${prefix}owner2  ${prefix}info  ${prefix}info2`, 95, 255);

      // ব্র্যান্ডিং
      ctx.fillStyle = "#00f2fe";
      ctx.font = "italic bold 11px sans-serif";
      ctx.fillText("⚡ powerd by : Sifat Ahmed", 370, 275);

      // ক্যাশে ইমেজ সেভ
      const cachePath = path.join(__dirname, `cache/owner2_${event.senderID}.png`);
      fs.ensureDirSync(path.join(__dirname, "cache"));

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cachePath, buffer);

      // বডি মেসেজ ছাড়া শুধু ছোট থাম্বনেইল পাঠানো
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
      return message.reply("⚠️ owner2 থাম্বনেইল কার্ড তৈরি করতে সমস্যা হয়েছে!");
    }
  }
};
