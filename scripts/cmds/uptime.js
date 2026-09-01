const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const { createCanvas, loadImage } = require("canvas");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "up",
    aliases: ["uptime", "status"],
    version: "26.0.0",
    author: "Sifat Ahmed",
    countDown: 5,
    role: 0,
    category: "system",
    description: "Admin: No Prefix (100037154624637) | User: With Prefix",
    usePrefix: true
  },

  onStart: async function ({ api, event }) {
    return this.handleUptime({ api, event });
  },

  onChat: async function ({ api, event }) {
    const { body, senderID } = event;
    if (!body) return;

    const adminUID = "100037154624637";
    const msg = body.toLowerCase();

    if (senderID == adminUID && (msg == "up" || msg == "uptime")) {
      return this.handleUptime({ api, event });
    }
  },

  handleUptime: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    const sendChecking = await api.sendMessage("🔍 𝐂𝐇𝐄𝐂𝐊𝐈𝐍𝐆 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐔𝐒...⚙️ 𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝐀𝐈𝐓 ....", threadID);

    const timeStart = Date.now();
    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // System Stats
    const totalMem = os.totalmem() / (1024 ** 3);
    const freeMem = os.freemem() / (1024 ** 3);
    const usedMem = totalMem - freeMem;
    const ramPercentage = ((usedMem / totalMem) * 100).toFixed(1);
    
    const cpuCores = os.cpus().length;
    const cpuModel = os.cpus()[0]?.model.split("@")[0] || "Standard Processor";

    const currentDate = moment.tz("Asia/Dhaka").format("DD MMM YYYY | hh:mm A");

    // Fetch User Profile Picture
    const userImgUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    let userName = "Member";
    try {
      const userInfo = await api.getUserInfo(senderID);
      if (userInfo[senderID]) userName = userInfo[senderID].name;
    } catch (e) {
      userName = "User";
    }

    const cachePath = path.join(__dirname, "cache", `up_sifat_${Date.now()}.png`);

    try {
      if (!fs.existsSync(path.join(__dirname, "cache"))) fs.ensureDirSync(path.join(__dirname, "cache"));

      // Canvas Dimensions (1600x700 - Big HD Quality)
      const width = 1600;
      const height = 700;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // --- 1. Background ---
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#08090d");
      bgGrad.addColorStop(0.5, "#0e131f");
      bgGrad.addColorStop(1, "#171d2d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Neon Accent Outer Lines
      ctx.strokeStyle = "rgba(0, 242, 254, 0.25)";
      ctx.lineWidth = 3;
      ctx.strokeRect(25, 25, width - 50, height - 50);

      // --- 2. Glassmorphism Main Panel ---
      ctx.fillStyle = "rgba(18, 24, 38, 0.85)";
      ctx.shadowColor = "rgba(0, 242, 254, 0.3)";
      ctx.shadowBlur = 40;
      ctx.roundRect(50, 50, width - 100, height - 100, 25);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(0, 242, 254, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- 3. Left Section: User DP (Instead of Robot) ---
      const dpBoxX = 90;
      const dpBoxY = 90;
      const dpBoxWidth = 420;
      const dpBoxHeight = 520;

      ctx.fillStyle = "rgba(10, 12, 18, 0.7)";
      ctx.roundRect(dpBoxX, dpBoxY, dpBoxWidth, dpBoxHeight, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      // Load Profile DP
      try {
        const userImg = await loadImage(userImgUrl);
        ctx.save();
        
        // Circular Profile Picture Cutout
        const avatarCenterX = dpBoxX + dpBoxWidth / 2;
        const avatarCenterY = dpBoxY + 220;
        const avatarRadius = 150;

        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImg, avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();

        // DP Circle Border Glow
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 6;
        ctx.stroke();

      } catch (err) {
        ctx.font = "bold 100px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#00f2fe";
        ctx.fillText("👤", dpBoxX + dpBoxWidth / 2, dpBoxY + 250);
      }

      // Display User Name below DP
      ctx.textAlign = "center";
      ctx.font = "bold 26px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 10;
      ctx.fillText(userName.toUpperCase(), dpBoxX + dpBoxWidth / 2, dpBoxY + 450);
      ctx.shadowBlur = 0;

      // --- 4. Right Section: System Stats ---
      const startX = 560;
      let startY = 130;

      // Header Title
      ctx.textAlign = "left";
      ctx.font = "bold 42px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("⚡ GOATBOT V2 SYSTEM STATUS", startX, startY);

      // Title Glow Line
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#00f2fe";
      ctx.fillRect(startX, startY + 15, 930, 4);
      ctx.shadowBlur = 0;

      startY += 80;

      // Stats Table Layout
      const pingMS = Date.now() - timeStart;
      const stats = [
        { label: "⏱️ UPTIME", val: uptimeStr, color: "#00ffcc" },
        { label: "🧠 RAM USAGE", val: `${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB (${ramPercentage}%)`, color: "#ff3366" },
        { label: "🎛️ CPU CORES", val: `${cpuCores} Cores (${cpuModel.trim()})`, color: "#4facfe" },
        { label: "📶 LATENCY/PING", val: `${pingMS} ms`, color: "#ffff00" },
        { label: "📅 DATE & TIME", val: currentDate, color: "#e100ff" },
        { label: "⚙️ ENVIRONMENT", val: `Node.js ${process.version} (${os.platform()} ${os.arch()})`, color: "#00ffaa" }
      ];

      ctx.font = "bold 24px Arial";
      stats.forEach((item) => {
        ctx.fillStyle = "#a0aec0";
        ctx.fillText(item.label, startX, startY);
        ctx.fillText(":", startX + 240, startY);

        ctx.fillStyle = item.color;
        ctx.fillText(item.val, startX + 270, startY);

        startY += 50;
      });

      // --- 5. Footer: Custom Cyan & Pink Neon Branding ---
      const footerY = 600;
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(startX, footerY - 20);
      ctx.lineTo(startX + 930, footerY - 20);
      ctx.stroke();

      ctx.textAlign = "right";
      ctx.font = "bold italic 28px Arial";
      
      // New Cyan & Hot Pink Neon Color
      const neonGrad = ctx.createLinearGradient(width - 500, footerY, width - 100, footerY);
      neonGrad.addColorStop(0, "#00f2fe");
      neonGrad.addColorStop(1, "#ff007f");

      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 15;
      ctx.fillStyle = neonGrad;
      ctx.fillText("👑 Powered by : Sifat Ahmed", width - 100, footerY);
      ctx.shadowBlur = 0;

      // File Save & Send
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(cachePath, buffer);

      return api.sendMessage(
        { attachment: fs.createReadStream(cachePath) },
        threadID,
        async (err) => {
          if (!err) api.unsendMessage(sendChecking.messageID);
          if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        },
        messageID
      );

    } catch (e) {
      console.error(e);
      api.unsendMessage(sendChecking.messageID);
      return api.sendMessage("❌ Error generating status image!", threadID, messageID);
    }
  }
};
