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
    version: "25.0.0",
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

    const cachePath = path.join(__dirname, "cache", `up_sifat_${Date.now()}.png`);

    try {
      if (!fs.existsSync(path.join(__dirname, "cache"))) fs.ensureDirSync(path.join(__dirname, "cache"));

      // Canvas Dimensions (1200x500)
      const width = 1200;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // --- 1. Dark Gradient Background ---
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#0a0c10");
      bgGrad.addColorStop(0.5, "#0d1117");
      bgGrad.addColorStop(1, "#161b22");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Neon Accent Lines
      ctx.strokeStyle = "rgba(0, 242, 254, 0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // --- 2. Glassmorphism Main Panel ---
      ctx.fillStyle = "rgba(22, 27, 34, 0.75)";
      ctx.shadowColor = "rgba(0, 242, 254, 0.2)";
      ctx.shadowBlur = 30;
      ctx.roundRect(40, 40, width - 80, height - 80, 20);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset Shadow

      // Border for Panel
      ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- 3. Left Section: 3D Robot Logo Box ---
      const robotBoxX = 70;
      const robotBoxY = 70;
      const robotBoxWidth = 320;
      const robotBoxHeight = 360;

      ctx.fillStyle = "rgba(10, 12, 16, 0.6)";
      ctx.roundRect(robotBoxX, robotBoxY, robotBoxWidth, robotBoxHeight, 15);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();

      // Load 3D Cyber Robot Banner Logo
      const robotLogoUrl = "https://i.imgur.com/2A48M3s.png"; // Dynamic High Quality Cyber Robot Avatar
      try {
        const robotImg = await loadImage(robotLogoUrl);
        ctx.save();
        ctx.roundRect(robotBoxX + 10, robotBoxY + 10, robotBoxWidth - 20, robotBoxHeight - 20, 10);
        ctx.clip();
        ctx.drawImage(robotImg, robotBoxX + 10, robotBoxY + 10, robotBoxWidth - 20, robotBoxHeight - 20);
        ctx.restore();
      } catch (err) {
        // Fallback Vector Robot Icon if image link fails
        ctx.font = "bold 90px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#00f2fe";
        ctx.fillText("🤖", robotBoxX + robotBoxWidth / 2, robotBoxY + 200);
      }

      // --- 4. Right Section: System Metrics ---
      const startX = 420;
      let startY = 100;

      // Header Title
      ctx.textAlign = "left";
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("⚡ GOATBOT V2 SYSTEM STATUS", startX, startY);

      // Title Glow Line
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#00f2fe";
      ctx.fillRect(startX, startY + 12, 680, 3);
      ctx.shadowBlur = 0;

      startY += 55;

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

      ctx.font = "bold 18px Arial";
      stats.forEach((item) => {
        // Label
        ctx.fillStyle = "#8b949e";
        ctx.fillText(item.label, startX, startY);
        ctx.fillText(":", startX + 180, startY);

        // Value with Neon Accent
        ctx.fillStyle = item.color;
        ctx.fillText(item.val, startX + 200, startY);

        startY += 36;
      });

      // --- 5. Footer: Powered By Sifat Ahmed ---
      const footerY = 415;
      
      // Divider Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(startX, footerY - 15);
      ctx.lineTo(startX + 680, footerY - 15);
      ctx.stroke();

      ctx.textAlign = "right";
      ctx.font = "bold italic 22px Arial";
      
      // Branding Gold Gradient Text
      const goldGrad = ctx.createLinearGradient(width - 400, footerY, width - 80, footerY);
      goldGrad.addColorStop(0, "#FFD700");
      goldGrad.addColorStop(1, "#FFA500");

      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 12;
      ctx.fillStyle = goldGrad;
      ctx.fillText("👑 Powered by : Sifat Ahmed", width - 80, footerY);
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
      return api.sendMessage("❌ Error generating system uptime canvas!", threadID, messageID);
    }
  }
};
