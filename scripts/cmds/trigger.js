𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃 DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "trigger",
    version: "1.2",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Trigger image",
    longDescription: "Trigger image (tag, reply, or yourself)",
    category: "fun",
    guide: {
      en: "{pn} [@tag | reply | empty]"
    }
  },

  onStart: async function ({ event, message, usersData, api }) {
    let uid;
    let w;

    // যদি কারও mention করে
    if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    }
    // যদি কারও মেসেজে reply করে
    else if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    }
    // নাহলে sender নিজেই
    else {
      uid = event.senderID;
    }

    try {
      // প্রসেসিং মেসেজ আপনার ডিজাইনে
      w = await message.reply(`🎨 𝗠𝗔𝗞𝗜𝗡𝗚 𝗚𝗜𝗙\n───────────────\n» ⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁, 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝘁𝗿𝗶𝗴𝗴𝗲𝗿 𝗚𝗜𝗙...\n───────────────\n» 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃`);

      const avatarURL = await usersData.getAvatarUrl(uid);
      const img = await new DIG.Triggered().getImage(avatarURL);
      const pathSave = `${__dirname}/tmp/${uid}_Trigger.gif`;

      // ডিরেক্টরি না থাকলে তৈরি করার সেফটি
      if (!fs.existsSync(`${__dirname}/tmp`)) {
        fs.mkdirSync(`${__dirname}/tmp`, { recursive: true });
      }

      fs.writeFileSync(pathSave, Buffer.from(img));

      if (w) api.unsendMessage(w.messageID);

      await message.reply({
        body: `💢 𝗧𝗥𝗜𝗚𝗚𝗘𝗥𝗘𝗗 𝗘𝗙𝗙𝗘𝗖𝗧\n───────────────\n» ✨ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱!\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃`,
        attachment: fs.createReadStream(pathSave)
      }, () => fs.unlinkSync(pathSave));

    } catch (e) {
      if (w) api.unsendMessage(w.messageID);
      message.reply(`❌ 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗢𝗡 𝗙𝗔𝗜𝗟𝗘𝗗\n───────────────\n» ⚙️ 𝗘𝗿𝗿𝗼𝗿 : ${e.message || "An error occurred."}\n───────────────\n» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝐒𝐈𝐅𝐀𝐓 𝐀𝐇𝐌𝐄𝐃`);
    }
  }
};
