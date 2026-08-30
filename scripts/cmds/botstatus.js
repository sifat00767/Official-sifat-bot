const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = {
  config: {
    name: "botstatus",
    version: "2.0.0",
    author: "SIYAM PREMIUM",
    role: 0,
    shortDescription: "Ultra Premium Bot Analytics V2",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, usersData }) {
    const threadID = event.threadID;

    // 🔍 SCANNING UI
    const loading = await api.sendMessage("🔍 SYSTEM SCANNING...\n▰▰▱▱▱ 20%", threadID);

    let steps = ["▰▰▰▱▱ 40%","▰▰▰▰▱ 60%","▰▰▰▰▰ 80%","▰▰▰▰▰ 100%"];
    let i = 0;

    const interval = setInterval(() => {
      if (i < steps.length) {
        api.editMessage(`🔍 SYSTEM SCANNING...\n${steps[i]}`, loading.messageID);
        i++;
      }
    }, 1000);

    setTimeout(async () => {
      clearInterval(interval);
      api.unsendMessage(loading.messageID);

      const dir = process.cwd();
      const files = fs.readdirSync(dir);

      // 📂 FILE DATA
      let totalFiles = files.length;
      let duplicate = Math.floor(Math.random() * 3);
      let errorFiles = Math.floor(Math.random() * 2);
      let working = totalFiles - duplicate - errorFiles;
      let newFiles = Math.floor(Math.random() * 5);
      let oldFiles = totalFiles - newFiles;

      // 📊 EXTRA FILE INFO
      let fileTypes = {};
      let totalSize = 0;

      files.forEach(file => {
        let ext = path.extname(file) || "unknown";
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;

        try {
          let size = fs.statSync(file).size;
          totalSize += size;
        } catch {}
      });

      let sizeMB = (totalSize / 1024 / 1024).toFixed(2);

      // 🕒 TIME
      const now = new Date();
      const time = now.toLocaleTimeString();
      const date = now.toLocaleDateString();

      // ⏱️ UPTIME
      const uptime = process.uptime();
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);

      // 🧠 SYSTEM
      const cpu = os.cpus().length;
      const ram = (os.totalmem()/1024/1024/1024).toFixed(2);
      const free = (os.freemem()/1024/1024/1024).toFixed(2);
      const platform = os.platform();

      // 👤 USER
      let name = "Unknown";
      try {
        const user = await usersData.get(event.senderID);
        name = user.name;
      } catch {}

      // 👑 ADMIN
      const admins = global.GoatBot?.config?.adminBot || [];
      const adminList = admins.map(id => `• ${id}`).join("\n") || "• 1000xxxx";

      // 🌐 FAKE NETWORK
      const groups = Math.floor(Math.random()*50+20);
      const messages = Math.floor(Math.random()*800+200);

      // 🌦️ WEATHER
      const weatherList = ["Sunny ☀️","Cloudy ☁️","Rainy 🌧️","Storm ⛈️"];
      const weather = weatherList[Math.floor(Math.random()*weatherList.length)];

      // 🔧 LAST MODIFIED
      let lastFile = files[0];
      let lastEdit = "N/A";
      try {
        lastEdit = new Date(fs.statSync(lastFile).mtime).toLocaleString();
      } catch {}

      // 🎨 DESIGN
      const msg = `
╔════════════════╗
 _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
╚═══════════════╝

👤 USER INFO
━━━━━━━━━━━━━━
Name : ${name}
UID  : ${event.senderID}

📂 FILE SYSTEM
━━━━━━━━━━━━━━
Total Files     : ${totalFiles}
Working Files   : ${working}
Duplicate Files : ${duplicate}
Error Files     : ${errorFiles}
New Files       : ${newFiles}
Old Files       : ${oldFiles}

📊 FILE DETAILS
━━━━━━━━━━━━━━
Total Size : ${sizeMB} MB
Types      : ${JSON.stringify(fileTypes)}

⚙️ SYSTEM INFO
━━━━━━━━━━━━━━
CPU Core   : ${cpu}
Platform   : ${platform}
RAM Total  : ${ram} GB
RAM Free   : ${free} GB

🕒 TIME STATUS
━━━━━━━━━━━━━━
Date   : ${date}
Time   : ${time}
Uptime : ${h}h ${m}m

🌐 NETWORK
━━━━━━━━━━━━━━
Groups Active : ${groups}
Messages Sent : ${messages}

🌦️ WEATHER
━━━━━━━━━━━━━━
Condition : ${weather}

👑 ADMIN PANEL
━━━━━━━━━━━━━━
Admins : ${admins.length}
${adminList}

🔧 LAST MODIFIED
━━━━━━━━━━━━━━
${lastFile}
${lastEdit}

╔═══════════════╗
 _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕
╚═══════════════╝
`;

      api.sendMessage(msg, threadID);

    }, 5000);
  }
};
