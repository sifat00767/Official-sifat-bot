const os = require('os');
const moment = require('moment-timezone');
const axios = require('axios');
const mongoose = require('mongoose');

module.exports = {
  config: {
    name: "uptime3",
    aliases: ["up3", "upt3"],
    version: "8.1.0",
    role: 0,
    author: "xalman",
    description: "Premium Uptime for Goat Bot V2 with Sequential Video",
    category: "system",
    guide: "{pn}",
    countDown: 5
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    // ১% থেকে ১০০% লোডিং অ্যানিমেশন
    const sendLoading = await api.sendMessage("⏳ 𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺: 𝟬%", threadID);

    const loadingSteps = ["𝟮𝟬%", "𝟰𝟬%", "𝟲𝟬%", "𝟴𝟬%", "𝟭𝟬𝟬%"];
    for (const step of loadingSteps) {
      await new Promise(resolve => setTimeout(resolve, 400)); // ৪00 মিলিসেকেন্ড ডিলে
      await api.editMessage(`⏳ 𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺: ${step}`, sendLoading.messageID).catch(() => {});
    }

    // আপটাইম এবং রিসোর্স ক্যালকুলেশন
    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);

    const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected 🟢" : "Disconnected 🔴";
    
    const timeNow = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const dateNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");

    // ক্রমানুসারে ভিডিও আসার লজিক
    const gifLinks = [
      "https://files.catbox.moe/9xm905.mp4", // ১ম ভিডিও লিংক
      "https://files.catbox.moe/tl221f.mp4"  // ২য় ভিডিও লিংক (টেস্ট করার জন্য এখানে ২য় লিংকটি পরিবর্তন করে নিতে পারেন)
    ];

    if (global.uptimeVideoIndex === undefined) {
      global.uptimeVideoIndex = 0;
    }
    const currentVideo = gifLinks[global.uptimeVideoIndex];
    
    // পরবর্তী কম্যান্ডের জন্য ইনডেক্স পরিবর্তন (+১)
    global.uptimeVideoIndex = (global.uptimeVideoIndex + 1) % gifLinks.length;

    const msg = `
◢◤━━━━━━━━━━━━◥◣
⚙️ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 ➜•V3•V5 
◥◣━━━━━━━━━━━━◢◤
『 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 
𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃  
💠 𝗨𝗽𝘁𝗶𝗺𝗲 𝗦𝘁𝗮𝘁𝘂𝘀:
  »→ ⏲️ 𝗧𝗶𝗺𝗲: ${days}𝗱 ${hours}𝗵 ${mins}𝗺 ${secs}𝘀
  »→ 🛰️ 𝗟𝗮𝘁𝗲𝗻𝗰𝘆: ${Date.now() - event.timestamp}𝗺𝘀
  »→ 🌐 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗔𝗰𝘁𝗶𝘃𝗲 ✔️
🍃 𝗗𝗮𝘁𝗮𝗯𝗮𝘀𝗲 (𝗠𝗼𝗻𝗴𝗼𝗼𝘀𝗲):
  »~ 🔌 𝗦𝘁𝗮𝘁𝘂𝘀: ${dbStatus}
  » 📁 𝗗𝗕 𝗡𝗮𝗺𝗲: TBTNX210
  » 🧬 𝗗𝗿𝗶𝘃𝗲𝗿: v${mongoose.version}
⚡ 𝗥𝗲𝘀𝗼𝘂𝗿𝗰𝗲𝘀:
  » 💾 𝗥𝗔𝗠: ${usedRam}𝗠𝗕 / ${totalRam}𝗚𝗕
  » 🔋 𝗟𝗼𝗮𝗱: [▓▓▓▓▓▓▓░░░]
  » ⚙️ 𝗡𝗼𝗱𝗲: ${process.version}
🕒 𝗧𝗶𝗺𝗲:
  » 📅 𝗗𝗮𝘁𝗲: ${dateNow}
  » ⏰ 𝗧𝗶𝗺𝗲: ${timeNow}
▬▬▬▬▬▬▬▬▬▬▬▬
   👤 𝗢𝘄𝗻𝗲𝗿: 𝐒𝐈𝐅𝐀𝐓
   `.trim();

    try {
      const stream = (await axios.get(currentVideo, { responseType: 'stream' })).data;

      // মেসেজ ওল্ড হয়ে গেলে যেন এরর না আসে তাই ট্রাই-ক্যাচ সেফটি দেওয়া হলো
      try {
        await api.unsendMessage(sendLoading.messageID);
      } catch (e) {
        console.log("Loading message unsend failed, skipping...");
      }
      
      return api.sendMessage({
        body: msg,
        attachment: stream
      }, threadID, messageID);
    } catch (error) {
      return api.editMessage(msg, sendLoading.messageID).catch(() => {});
    }
  }
};
