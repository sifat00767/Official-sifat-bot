module.exports.config = {
  name: "ruls",
  version: "1.0.3",
  permission: 0,
  credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  prefix: true,
  description: "rules",
  category: "rules",
  usages: "",
  cooldowns: 5,
};

module.exports.onStart = async function ({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const groupName = threadInfo.threadName || "এই গ্রুপ";
    const groupImage = threadInfo.imageSrc;

    const imgPath = __dirname + "/cache/group.jpg";

    if (groupImage) {
      const imgRes = await axios.get(groupImage, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));
    }

    const msg = {
      body: `╭╼|━━━━━━━━━━━━━|╾╮
🌸 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂 𝗔𝗹𝗮𝗶𝗸𝘂𝗺 🌸

👥 গ্রুপ: ${groupName}

━━━━━━━━━━━━━━━━━━
📌 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦 📌
━━━━━━━━━━━━━━━━━━

🔹 সবাই একে অপরকে সম্মান করবে 🤝
🔹 অশালীন / 18+ কথা সম্পূর্ণ নিষিদ্ধ 🚫
🔹 ঝগড়া, গালি বা হেইট স্পিচ করা যাবে না ❌
🔹 স্প্যাম / লিংক শেয়ার নিষিদ্ধ 📵
🔹 অনুমতি ছাড়া মেম্বারদের DM করা যাবে না 🚷
🔹 গ্রুপের পরিবেশ নষ্ট করা যাবে না 🌿
🔹 ৩ দিন ইনঅ্যাকটিভ থাকলে অ্যাডমিন অ্যাকশন নিতে পারে ⛔

━━━━━━━━━━━━━━━━━━
💡 𝗡𝗢𝗧𝗜𝗖𝗘 💡
👉 এই গ্রুপ একটি  ফ্যামিলি আড্ডা বক্স
👉 সবাই মিলে ভালো পরিবেশ বজায় রাখবো
👉 নিয়ম না মানলে ওয়ার্নিং ছাড়া কিক ফ্রী

━━━━━━━━━━━━━━━━━━
💚 ধন্যবাদ আমাদের সাথে থাকার জন্য 💚

🌸 𝐂𝐄𝐎 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 🌸
Creator:𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃
╰╼|━━━━━━━━━━━━━|╾╯`,
      attachment: groupImage ? fs.createReadStream(imgPath) : null
    };

    api.sendMessage(msg, event.threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

  } catch (e) {
    console.log(e);
    api.sendMessage("কিছু সমস্যা হয়েছে!", event.threadID);
  }
};
