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
    version: "30.0.0",
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

    // Fetch User DP
    const userImgUrl = `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

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

      // Canvas Dimensions (1080x1600 - Tall Vertical Poster for Maximum Chat Display)
      const width = 1080;
      const height = 1600;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // --- 1. Dark Neon Background ---
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#05070a");
      bgGrad.addColorStop(0.5, "#0b101d");
      bgGrad.addColorStop(1, "#151b29");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Outer Glow Frame
      ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // --- 2. Main Glassmorphism Box ---
      ctx.fillStyle = "rgba(16, 22, 36, 0.88)";
      ctx.shadowColor = "rgba(0, 242, 254, 0.35)";
      ctx.shadowBlur = 40;
      ctx.roundRect(60, 60, width - 120, height - 120, 35);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(0, 242, 254, 0.6)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // --- 3. Top Header Title ---
      ctx.textAlign = "center";
      ctx.font = "bold 52px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("⚡ GOATBOT V2 STATUS", width / 2, 160);

      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#00f2fe";
      ctx.fillRect(150, 190, width - 300, 6);
      ctx.shadowBlur = 0;

      // --- 4. User Large Circular DP Section ---
      const avatarCenterX = width / 2;
      const avatarCenterY = 420;
      const avatarRadius = 180;

      try {
        const userImg = await loadImage(userImgUrl);
        ctx.save();
        ctx.shadowColor = "#00f2fe";
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImg, avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();

        // Glowing DP Ring
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "#00f2fe";
        ctx.lineWidth = 10;
        ctx.stroke();

      } catch (err) {
        ctx.font = "bold 140px Arial";
        ctx.fillStyle = "#00f2fe";
        ctx.fillText("👤", avatarCenterX, avatarCenterY + 40);
      }

      // User Name Label
      ctx.font = "bold 42px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 15;
      ctx.fillText(userName.toUpperCase(), width / 2, 670);
      ctx.shadowBlur = 0;

      // --- 5. System Stats Vertical List ---
      let startY = 780;
      const pingMS = Date.now() - timeStart;
      const stats = [
        { label: "⏱️ UPTIME", val: uptimeStr, color: "#00ffcc" },
        { label: "🧠 RAM USAGE", val: `${usedMem.toFixed(2)}GB / ${totalMem.toFixed(2)}GB (${ramPercentage}%)`, color: "#ff3366" },
        { label: "🎛️ CPU CORES", val: `${cpuCores} Cores`, color: "#4facfe" },
        { label: "📶 LATENCY", val: `${pingMS} ms`, color: "#ffff00" },
        { label: "📅 DATE & TIME", val: currentDate, color: "#e100ff" },
        { label: "⚙️ OS PLATFORM", val: `${os.platform()} (${os.arch()})`, color: "#00ffaa" }
      ];

      stats.forEach((item) => {
        // Card Background for Each Stat
        ctx.fillStyle = "rgba(10, 14, 23, 0.7)";
        ctx.roundRect(100, startY - 40, width - 200, 75, 15);
        ctx.fill();

        ctx.textAlign = "left";
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#a0aec0";
        ctx.fillText(item.label, 130, startY + 8);

        ctx.textAlign = "right";
        ctx.fillStyle = item.color;
        ctx.fillText(item.val, width - 130, startY + 8);

        startY += 95;
      });

      // --- 6. Footer Branding (Cyan & Pink) ---
      const footerY = 1480;
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.moveTo(100, footerY - 40);
      ctx.lineTo(width - 100, footerY - 40);
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.font = "bold italic 36px Arial";
      
      const neonGrad = ctx.createLinearGradient(200, footerY, width - 200, footerY);
      neonGrad.addColorStop(0, "#00f2fe");
      neonGrad.addColorStop(1, "#ff007f");

      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 20;
      ctx.fillStyle = neonGrad;
      ctx.fillText("👑 Powered by : Sifat Ahmed", width / 2, footerY);
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
