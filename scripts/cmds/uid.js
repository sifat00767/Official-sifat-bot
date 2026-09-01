const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "uid",
    version: "4.0.0",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    nonPrefix: true, // Prefix ছাড়া এবং Prefix সহ - দুইভাবেই সমান কাজ করবে
    shortDescription: {
      en: "Get user's UID and Stylist Banner"
    },
    longDescription: {
      en: "Generates an advanced banner (1200x500) with accurate target User ID, Name, and Avatar."
    },
    category: "info",
    guide: {
      en: "{pn} [mention | reply | leave blank]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;
    const cachePath = path.join(__dirname, "cache", `uid_${Date.now()}.png`);

    // ১. মেনশন, রিপ্লাই বা আর্গুমেন্ট থেকে নিখুঁতভাবে টার্গেট ইউজার আইডি শনাক্ত করা
    let targetID = senderID;

    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0 && !isNaN(args[0])) {
      targetID = args[0];
    }

    const processMsg = await api.sendMessage("-ˋˏ✄━═━═━═", threadID);

    try {
      // ২. ব্যবহারকারীর সঠিক নাম বের করার সিস্টেম (ডিবি + ফেসবুক ব্যাকআপ API)
      let name = "FB User";
      
      try {
        const userInfo = await api.getUserInfo(targetID);
        if (userInfo && userInfo[targetID] && userInfo[targetID].name) {
          name = userInfo[targetID].name;
        } else {
          const userData = await usersData.get(targetID);
          if (userData && userData.name) name = userData.name;
        }
      } catch (e) {
        const userData = await usersData.get(targetID);
        if (userData && userData.name) name = userData.name;
      }

      // ৩. ক্যানভাস সেটআপ (1200x500 HD Banner)
      const width = 1200;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      ctx.antialias = "subpixel";

      // ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#090a16");
      bgGradient.addColorStop(0.5, "#101428");
      bgGradient.addColorStop(1, "#070811");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // গ্লাস বক্স Overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(30, 30, width - 60, height - 60);

      // নিওন বর্ডার
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // ৪. প্রোফাইল পিকচার (Avatar) লোড
      let avatarImg;
      try {
        const avatarUrl = `https://graph.facebook.com/${targetID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        avatarImg = await loadImage(Buffer.from(res.data));
      } catch (e) {
        avatarImg = await loadImage("https://i.imgur.com/6V403qG.png");
      }

      // অ্যাভাটার নিওন গ্লো ও শেপ
      const avatarX = 230;
      const avatarY = 250;
      const radius = 135;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
      ctx.restore();

      // ৫. টেক্সট লেআউট
      const textStartX = 430;

      // NAME
      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("NAME", textStartX, 170);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 42px sans-serif";
      ctx.fillText(`: ${name}`, textStartX + 130, 170);

      // UID
      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("UID", textStartX, 270);

      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 40px sans-serif";
      ctx.fillText(`: ${targetID}`, textStartX + 130, 270);

      // ডিভাইডার লাইন
      ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
      ctx.fillRect(textStartX, 330, 680, 3);

      // ব্র্যান্ডিং
      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("⚡ powerd by :", textStartX, 395);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("Sifat Ahmed", textStartX + 220, 395);

      // ৬. সেভ এবং সেন্ড
      fs.ensureDirSync(path.join(__dirname, "cache"));
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cachePath, buffer);

      api.unsendMessage(processMsg.messageID);

      return api.sendMessage(
        {
          body: `🆔 UID: ${targetID}`,
          attachment: fs.createReadStream(cachePath)
        },
        threadID,
        () => {
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        },
        messageID
      );

    } catch (error) {
      console.error(error);
      api.unsendMessage(processMsg.messageID);
      return api.sendMessage("❌ Error generating image: " + error.message, threadID, messageID);
    }
  }
};
