const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const yts = require("yt-search");

module.exports = {
  config: {
    name: "ytb",
    aliases: ["youtube", "yt", "ytb2"],
    version: "4.0",
    author: "Siyam Hasan (Direct Scraping)",
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

      // Direct Scraping with yt-search package (No external API dependancy for search)
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

      let downloadLink = null;

      // 🔄 Downloader Multi-Fallback Logic (4 Alternative Engines)
      
      // Engine 1: David Cyril Tech API
      try {
        const res1 = await axios.get(`https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`);
        downloadLink = res1.data?.result?.url || res1.data?.result?.download_url;
      } catch (e) {}

      // Engine 2: Ytdl / Guru API
      if (!downloadLink) {
        try {
          const res2 = await axios.get(`https://api.guruapi.tech/ytmp4?url=${encodeURIComponent(videoUrl)}`);
          downloadLink = res2.data?.url;
        } catch (e) {}
      }

      // Engine 3: Dark Ytdl API
      if (!downloadLink) {
        try {
          const res3 = await axios.get(`https://dark-ytdl-api.vercel.app/download?url=${encodeURIComponent(videoUrl)}`);
          downloadLink = res3.data?.url;
        } catch (e) {}
      }

      // Engine 4: BK9 API
      if (!downloadLink) {
        try {
          const res4 = await axios.get(`https://bk9.fun/download/youtube?url=${encodeURIComponent(videoUrl)}`);
          downloadLink = res4.data?.BK9?.list?.[0]?.url || res4.data?.BK9?.url;
        } catch (e) {}
      }

      if (!downloadLink) {
        throw new Error("সবগুলো ডাউনলোড সার্ভার ব্যস্ত আছে! কিছুক্ষণ পর আবার চেষ্টা করুন।");
      }

      const filePath = path.join(__dirname, "cache", `yt_${Date.now()}.mp4`);

      const response = await axios({
        url: downloadLink,
        method: "GET",
        responseType: "stream",
        timeout: 180000
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

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

      writer.on("error", () => {
        api.sendMessage("❌ ভিডিও ফাইল সেভ করতে সমস্যা হয়েছে।", event.threadID);
      });

    } catch (e) {
      api.sendMessage(`❌ ডাউনলোডে সমস্যা: ${e.message}`, event.threadID, event.messageID);
    }
  }
};
