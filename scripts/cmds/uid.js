const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "uid",
    version: "2.5.0",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get user's UID and Stylist Banner"
    },
    longDescription: {
      en: "Generates an advanced Cool style banner (1200x500) with User ID and Avatar."
    },
    category: "info",
    guide: {
      en: "{pn} [mention | reply | leave blank]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;
    const cachePath = path.join(__dirname, "cache", `uid_${Date.now()}.png`);

    // 1. Find Target User ID
    let targetID = senderID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0) {
      if (!isNaN(args[0])) {
        targetID = args[0];
      }
    }

    // Send processing message
    const processMsg = await api.sendMessage("-ˋˏ✄━═━═━═", threadID);

    try {
      // 2. Fetch User Data
      const userData = await usersData.get(targetID);
      const name = userData.name || "Unknown User";

      // 3. Setup Canvas (1200x500 - High Quality HD Banner)
      const width = 1200;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      ctx.antialias = "subpixel";

      // --- HIGH QUALITY GRADIENT BACKGROUND ---
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#090a16");
      bgGradient.addColorStop(0.5, "#101428");
      bgGradient.addColorStop(1, "#070811");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Glassmorphism Box Overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath();
      ctx.roundRect(30, 30, width - 60, height - 60, 24);
      ctx.fill();

      // Neon Outer Borders
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(30, 30, width - 60, height - 60, 24);
      ctx.stroke();

      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, 40, width - 80, height - 80, 18);
      ctx.stroke();

      // --- AVATAR HANDLING ---
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      let avatarBuffer;
      try {
        const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        avatarBuffer = response.data;
      } catch (e) {
        const fallbackUrl = `https://graph.facebook.com/${targetID}/picture?type=large`;
        const response = await axios.get(fallbackUrl, { responseType: "arraybuffer" });
        avatarBuffer = response.data;
      }

      const avatarImg = await loadImage(avatarBuffer);

      // Circle Avatar with Neon Glow (Scaled up for 1200x500)
      const avatarX = 230;
      const avatarY = 250;
      const radius = 135;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 6;
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
      ctx.restore();

      // --- TEXT DETAILS (RIGHT SIDE) ---
      const textStartX = 430;

      // NAME
      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("NAME", textStartX, 170);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 42px sans-serif";
      ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
      ctx.shadowBlur = 12;
      ctx.fillText(`: ${name}`, textStartX + 130, 170);
      ctx.shadowBlur = 0;

      // UID
      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("UID", textStartX, 270);

      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 40px sans-serif";
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 15;
      ctx.fillText(`: ${targetID}`, textStartX + 130, 270);
      ctx.shadowBlur = 0;

      // Separator Line
      ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
      ctx.fillRect(textStartX, 330, 680, 3);

      // Branding (Powerd by)
      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("⚡ powerd by :", textStartX, 395);

      ctx.fillStyle = "#ffffff";
      ctx.font = "italic bold 26px sans-serif";
      ctx.fillText("Sifat Ahmed", textStartX + 220, 395);

      // --- SAVE & SEND ---
      const buffer = canvas.toBuffer("image/png");
      fs.ensureDirSync(path.join(__dirname, "cache"));
      fs.writeFileSync(cachePath, buffer);

      // Unsend processing message
      api.unsendMessage(processMsg.messageID);

      // Send Result
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
