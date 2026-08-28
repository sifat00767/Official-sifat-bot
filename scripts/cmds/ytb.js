const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ytb",
    aliases: ["youtube", "yt", "ytb2"],
    version: "2.5",
    author: "Siyam Hasan (Fixed & Optimized)",
    countDown: 6,
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

      // Multiple fallback search APIs
      let results = [];
      try {
        const searchRes = await axios.get(`https://invidious.nerdvpn.de/api/v1/search?q=${encodeURIComponent(input)}`);
        results = searchRes.data.filter(v => v.type === "video").slice(0, 6);
      } catch (e) {
        const searchRes = await axios.get(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(input)}&filter=videos`);
        results = searchRes.data.items.slice(0, 6);
      }

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
              const thumbUrl = r.videoThumbnails?.[0]?.url || r.thumbnail || (r.thumbnailUrl ? r.thumbnailUrl : null);
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
        const title = r.title;
        const time = r.lengthSeconds ? `${Math.floor(r.lengthSeconds / 60)}:${r.lengthSeconds % 60}` : (r.duration || "N/A");
        const id = r.videoId || (r.url ? r.url.split("v=")[1] : r.id);
        msg += `${i + 1}. ${title}\n⏱ ${time}\n\n`;
        return { id, title };
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
      return api.sendMessage(`❌ API সমস্যা: ${e.message}`, threadID, messageID);
    }
  },

  onReply: async function ({ event, api, Reply }) {
    const { results, author, menuMsgID } = Reply;

    if (event.senderID !== author) return;

    const choice = parseInt(event.body);
    if (!choice || choice < 1 || choice > results.length) return;

    const videoID = results[choice - 1].id;
    const title = results[choice - 1].title;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      try {
        if (menuMsgID) api.unsendMessage(menuMsgID);
      } catch {}

      const videoUrl = `https://www.youtube.com/watch?v=${videoID}`;
      let downloadLink = null;

      // Cobalt POST Request Fix
      try {
        const cobaltRes = await axios.post("https://api.cobalt.tools/api/json", {
          url: videoUrl,
          videoQuality: "720"
        }, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "referer": "https://cobalt.tools/"
          }
        });
        downloadLink = cobaltRes.data?.url;
      } catch (e) {
        // Fallback Downloader API
        const fallbackRes = await axios.get(`https://api.vyt.workers.dev/download?id=${videoID}`).catch(() => null);
        downloadLink = fallbackRes?.data?.url;
      }

      if (!downloadLink) throw new Error("ডাউনলোড লিংক প্রস্তুত করা সম্ভব হয়নি।");

      const filePath = path.join(__dirname, "cache", `yt_${Date.now()}.mp4`);

      const response = await axios({
        url: downloadLink,
        method: "GET",
        responseType: "stream",
        timeout: 120000
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
        api.sendMessage("❌ ফাইল সেভ করতে সমস্যা হয়েছে", event.threadID);
      });

    } catch (e) {
      api.sendMessage(`❌ সমস্যা: ${e.message}`, event.threadID, event.messageID);
    }
  }
};
