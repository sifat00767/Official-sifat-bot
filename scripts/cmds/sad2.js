const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "sad2",
  version: "1.0.1",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "🎬 প্রতিবার কমান্ডে আলাদা ভিডিও এবং স্যাড ক্যাপশন পাঠাবে",
  category: "Fun",
  countDown: 5,
};

// ✅ বটের মূল ক্যাশের ক্ষতি না করে সম্পূর্ণ আলাদা ক্যাশ ফোল্ডার তৈরি
const sab2CacheDir = path.join(__dirname, "sab2_cache");
if (!fs.existsSync(sab2CacheDir)) {
  fs.mkdirSync(sab2CacheDir, { recursive: true });
}

// ✅ আপনার দেওয়া ৩৫টি ইউনিক লিংক এবং সাথে মানানসই সুন্দর শর্ট ও স্যাড ক্যাপশন সেটআপ
const videoData = [
  { url: "https://files.catbox.moe/2ii8c7.mp4", text: "কিছু গল্প কখনো শেষ হয় না, শুধু চরিত্রগুলো বদলে যায়..!! 🥀" },
  { url: "https://files.catbox.moe/ah0s9r.mp4", text: "সবচেয়ে কঠিন হলো কারো অবহেলা পাওয়ার পরও তাকেই ভালোবেসে যাওয়া..!! 💔" },
  { url: "https://files.catbox.moe/ydwkrm.mp4", text: "একাকীত্ব কখনো মানুষকে মারে না, শুধু ভেতর থেকে পুড়িয়ে ছাই করে দেয়..!! 🖤" },
  { url: "https://files.catbox.moe/111n24.mp4", text: "যার জন্য পুরো পৃথিবীর সাথে লড়েছিলাম, আজ সে-ই আমার অপবাদের কারণ..!! 🥺" },
  { url: "https://files.catbox.moe/ebyeyi.mp4", text: "স্মৃতিগুলো बড্ড অদ্ভুত, হাসির দিনে কাঁদায় আর কান্নার দিনে হাসায়..!! ⏳" },
  { url: "https://files.catbox.moe/olpzpk.mp4", text: "অভিযোগ করে কী হবে? যার কপালে অবহেলা লেখা, সে তো অবহেলাই পাবে..!! 🥀" },
  { url: "https://files.catbox.moe/3y330y.mp4", text: "ভালো থাকার অভিনয় করতে করতে আজ আমি ক্লান্ত, কেউ বুঝলো না আমায়..!! 🖤" },
  { url: "https://files.catbox.moe/j4fhyp.mp4", text: "তুমি তো ভালোই আছো আমাকে ছাড়া, কষ্টটা তো শুধু আমার একার..!! 💔" },
  { url: "https://files.catbox.moe/gc2ard.mp4", text: "ভরসা তাকেই করো যে তোমার হাসির পেছনে লুকিয়ে থাকা কষ্টটা বোঝে..!! ✨" },
  { url: "https://files.catbox.moe/44oya3.mp4", text: "যে চলে যায় সে কোনো অজুহাতে থাকে না, আর যে থাকার সে এমনিতেই থাকে..!! 🥀" },
  { url: "https://files.catbox.moe/ffvnm1.mp4", text: "হারিয়ে ফেলা মানুষকে হয়তো খোঁজা যায়, কিন্তু বদলে যাওয়া মানুষকে কখনো নয়..!! 💔" },
  { url: "https://files.catbox.moe/c5ja93.mp4", text: "মাঝে মাঝে মনে হয়, ভালো না বেসে ভালো থাকলেই বোধহয় বেশি ভালো হতো..!! 🖤" },
  { url: "https://files.catbox.moe/56bgjp.mp4", text: "পরিস্থিতি আজ এমন এক জায়গায় এনে দাঁড় করিয়েছে, যেখানে নিজের বলতে কেউ নেই..!! 🥺" },
  { url: "https://files.catbox.moe/2l5loh.mp4", text: "নীরবে কেঁদে যাওয়ার নামই হয়তো জীবন, এখানে বোঝার মতো কেউ নেই..!! 🥀" },
  { url: "https://files.catbox.moe/0j8bwh.mp4", text: "কিছু ক্ষত কখনো শুকায় না, শুধু সহ্য করার ক্ষমতাটুকু বেড়ে যায়..!! 💔" },
  { url: "https://files.catbox.moe/4hjg4f.mp4", text: "তুমি তো শুধু আমার গল্পে আছো, বাস্তবে তুমি তো অন্য কারো আকাশ..!! 🖤" },
  { url: "https://files.catbox.moe/l5bfws.mp4", text: "যার হারানোর ভয় সবচেয়ে বেশি ছিল, আজ সে নিজেই আমাকে হারিয়ে দিলো..!! 🥺" },
  { url: "https://files.catbox.moe/7nvnsi.mp4", text: "কিছু পাওয়ার চেয়ে হারিয়ে ফেলার বেদনা বড্ড বেশি তীব্র হয়..!! 🥀" },
  { url: "https://files.catbox.moe/j7gndp.mp4", text: "আজকের এই চোখের জল হয়তো একদিন শুকিয়ে যাবে, কিন্তু ক্ষতের দাগ থেকে যাবে..!! 💔" },
  { url: "https://files.catbox.moe/9tfka4.mp4", text: "স্বপ্ন দেখা সহজ, কিন্তু একটা ভাঙা স্বপ্ন নিয়ে বেঁচে থাকা বড্ড কঠিন..!! 🖤" },
  { url: "https://files.catbox.moe/6dyzum.mp4", text: "আমরা দুজন দুজনাকে ঠিকই পেয়েছিলাম, শুধু ভাগ্যটাই আমাদের পাশে ছিল না..!! 🥀" },
  { url: "https://files.catbox.moe/hgf9vq.mp4", text: "কাউকে জোর করে ধরে রাখা যায় না, যে যাওয়ার সে হাত ছেড়ে চলে যাবেই..!! 💔" },
  { url: "https://files.catbox.moe/3e5pct.mp4", text: "ভালো থেকো অন্যের শহরের রাজকুমারী হয়ে, আমি আমার একাকীত্ব নিয়েই সুখে আছি..!! 🖤" },
  { url: "https://files.catbox.moe/uak967.mp4", text: "কিছু মানুষ ভালো না বেসেও অভিনয়টা এমনভাবে করে, যেন তারা নিষ্পাপ..!! 🥺" },
  { url: "https://files.catbox.moe/4lul8c.mp4", text: "মন ভাঙার শব্দ কখনো হয় না, হলে আজ পুরো পৃথিবী স্তব্ধ হয়ে যেত..!! 🥀" },
  { url: "https://files.catbox.moe/ovcvmm.mp4", text: "ভালোবাসা জিনিসটা শুধু উপহার দিতে জানে না, কেড়ে নিতেও ওস্তাদ..!! 💔" },
  { url: "https://files.catbox.moe/1dcqi3.mp4", text: "কাউকে এতটা আপন ভেবো না, যাতে সে চলে গেলে নিজের অস্তিত্বই হারিয়ে যায়..!! 🖤" },
  { url: "https://files.catbox.moe/u5eqv4.mp4", text: "আজকের অবহেলাটাই হয়তো আগামীকালের সব স্মৃতি মুছে ফেলার শক্তি জোগাবে..!! 🥀" },
  { url: "https://files.catbox.moe/ym8tn3.mp4", text: "একটু সুখের আশায় এসেছিলাম, কিন্তু দুঃখের নদীটাই বেশি গভীর ছিল..!! 💔" },
  { url: "https://files.catbox.moe/jqusfc.mp4", text: "সময়ের সাথে সাথে সবাই বদলে যায়, শুধু কিছু বোকা স্মৃতি রয়ে যায় অবিকল..!! 🖤" },
  { url: "https://files.catbox.moe/nacfgz.mp4", text: "মন থেকে যাকে চাওয়া যায়, তাকে হয়তো কখনো নিজের ভাগ্যে পাওয়া যায় না..!! 🥺" },
  { url: "https://files.catbox.moe/rbp7hg.mp4", text: "আমরা সবাই ভালো থাকার অভিনয় করি, কিন্তু ভেতরের খবর কেউ রাখে না..!! 🥀" },
  { url: "https://files.catbox.moe/yiigq2.mp4", text: "কিছু মানুষের নীরবতা মানে অহংকার নয়, তাদের সহ্য ক্ষমতার শেষ সীমানা..!! 💔" },
  { url: "https://files.catbox.moe/51d6w6.mp4", text: "আজ আমি অন্যের চোখের বালি, অথচ একদিন কারো চোখের মণি ছিলাম..!! 🖤" },
  { url: "https://files.catbox.moe/zw6atp.mp4", text: "আশা করি তুমি তোমার নতুন জীবনে অনেক সুখী হবে, আমার গল্প এখানেই সমাপ্ত..!! 🥀💔" }
];

// গ্লোবাল ভ্যারিয়েবল কাউন্টার রাখার জন্য (প্রতিবার রান হলে ইন্ডেক্স বাড়বে)
if (global.sad2Index === undefined) {
  global.sad2Index = 0;
}

// ✅ এরর ফিক্স: মডিউলের জন্য অনস্টার্ট ফাংশন সেটআপ করা হলো
module.exports.onStart = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // বর্তমান ইন্ডেক্সের ডেটা নেওয়া
    const currentIndex = global.sad2Index;
    const currentVideo = videoData[currentIndex];

    // ভিডিওর ইউনিক নাম এবং পাথ তৈরি
    const videoName = `sad2_video_${currentIndex}.mp4`;
    const videoPath = path.join(sab2CacheDir, videoName);

    // ইউজারকে একটি ওয়েটিং মেসেজ দেওয়া
    api.sendMessage("⏳ 𝗟𝗢𝗔𝗗𝗜𝗡𝗚 · 𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧...", threadID, async (err, info) => {
      
      try {
        // ভিডিওটি আগে ডাউনলোড করা না থাকলে নতুন করে ডাউনলোড হবে
        if (!fs.existsSync(videoPath) || fs.statSync(videoPath).size === 0) {
          const response = await axios.get(currentVideo.url, {
            responseType: "arraybuffer",
          });
          fs.writeFileSync(videoPath, Buffer.from(response.data));
        }

        // ওয়েটিং মেসেজটি ডিলিট (unsend) করা
        if (info && info.messageID) {
          api.unsendMessage(info.messageID);
        }

        // সুন্দর ক্যাপশন ডিজাইন
        const caption = `
╭───────────────⭓
  ${currentVideo.text}
 ───────────────⭓
_⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡  
╰───────────────⭓
`;

        // ভিডিও এবং চ্যাট ক্যাপশন একসাথে পাঠানো
        api.sendMessage(
          {
            body: caption,
            attachment: fs.createReadStream(videoPath),
          },
          threadID,
          messageID
        );

        // ইন্ডেক্স পরবর্তী ভিডিওর জন্য আপডেট করা (৩৫টি পার হলে আবার ০ থেকে শুরু হবে)
        global.sad2Index = (global.sad2Index + 1) % videoData.length;

      } catch (downloadError) {
        console.error("❌ Sad2 Download Error:", downloadError);
        api.sendMessage("❌ ভিডিওটি পাঠাতে সমস্যা হচ্ছে! আবার চেষ্টা করুন।", threadID, messageID);
      }
    }, messageID);

  } catch (error) {
    console.error("❌ Sad2 Execution Error:", error);
    api.sendMessage("❌ কমান্ডটি রান করতে কোনো সমস্যা হয়েছে!", threadID, messageID);
  }
};
