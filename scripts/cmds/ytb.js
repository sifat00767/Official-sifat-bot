const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  config: {
    name: "ytb",
    aliases: ["youtube", "yt", "ytb2"],
    version: "5.0",
    author: "Siyam Hasan (No-API Direct Stream)",
    countDown: 5,
    role: 0,
    description: {
      bn: "YouTube ভিডিও সার্চ ও ডাউনলোড (ytb থাম্বনেইল সহ, ytb2 থাম্বনেইল ছাড়া)",
      en: "YouTube search & download system"
    },
    category: "media"
  },

  langs: {
    bn: {
      error: "❌ সমস্যা: %1",
      noResult: "⭕ কিছু পাওয়া যায়নি: %1"
    }
  },

  onStart: async function ({ api, args, event, getLang }) {
    const { threadID, messageID, senderID } = event;
    const input = args.join(" ").trim();

    if (!input) {
      return api.sendMessage("👉 ব্যবহার: ytb song name অথবা ytb2 song name", threadID, messageID);
    }

    const usedCommand = event.body.split(" ")[0].toLowerCase();
    const isYtb2 = usedCommand.includes("ytb2");

    try {
      api.setMessageReaction("🔎", messageID, () => {}, true);

      const searchResult = await yts(input);
      const results = searchResult.videos.slice(0, 6);

      if (!results || !results.length) {
        return api.sendMessage(getLang("noResult", input), threadID, messageID);
      }

      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);

      let msg = "";
      let attachments = [];

      if (!isYtb2) {
        const thumbs = await Promise.all(
          results.map(async (r, i) => {
            try {
              const thumbUrl = r.thumbnail || r.image;
              if (!thumbUrl) return null;
              
              const thumbPath = path.join(cacheDir, `thumb_${senderID}_${Date.now()}_${i}.jpg`);
              const res = await axios.get(thumbUrl, { responseType: "arraybuffer", timeout: 8000 });
              fs.writeFileSync(thumbPath, Buffer.from(res.data));
              return fs.createReadStream(thumbPath);
            } catch {
              return null;
            }
          })
        );
        attachments = thumbs.filter(Boolean);
      }

      const formattedResults = results.map((r, i) => {
        msg += `${i + 1}. ${r.title}\n⏱ ${r.timestamp}\n\n`;
        return { id: r.videoId, title: r.title, url: r.url };
      });

      return api.sendMessage(
        {
          body: `📌 নাম্বার দিয়ে রিপ্লাই করো:\n\n${msg}`,
          attachment: attachments.length ? attachments : undefined
        },
        threadID,
        (err, info) => {
          if (err) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: senderID,
            results: formattedResults,
            menuMsgID: info.messageID
          });
        },
        messageID
      );

    } catch (e) {
      return api.sendMessage(`❌ সার্চে সমস্যা: ${e.message}`, threadID, messageID);
    }
  },

  onReply: async function ({ event, api, Reply }) {
    const { results, author, menuMsgID } = Reply;

    if (event.senderID !== author) return;

    const choice = parseInt(event.body);
    if (!choice || choice < 1 || choice > results.length) return;

    const videoData = results[choice - 1];
    const videoUrl = videoData.url;
    const title = videoData.title;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      try {
        if (menuMsgID) api.unsendMessage(menuMsgID);
      } catch {}

      const filePath = path.join(__dirname, "cache", `yt_${Date.now()}.mp4`);

      // Direct Stream Download using ytdl-core (No External Download API needed)
      const stream = ytdl(videoUrl, {
        quality: "lowestvideo", // 360p/480p standard for messenger limits
        filter: "audioandvideo"
      });

      const writer = fs.createWriteStream(filePath);
      stream.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `👑 𝗢𝗪𝗡𝗘𝗥 🪄 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n\n🎬 ${title}`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => {
            setTimeout(() => {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }, 5000);
          },
          event.messageID
        );
      });

      writer.on("error", (err) => {
        api.sendMessage(`❌ স্ট্রিম ডাউনলোডে সমস্যা: ${err.message}`, event.threadID);
      });

    } catch (e) {
      api.sendMessage(`❌ ডাউনলোডে সমস্যা: ${e.message}`, event.threadID, event.messageID);
    }
  }
};
