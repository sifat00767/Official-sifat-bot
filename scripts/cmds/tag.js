module.exports = {
  config: {
    name: "tag",
    version: "1.0",
    author: "MR_FARHAN",
    role: 0,
    category: "GROUP",
    shortDescription: "Random message",
    longDescription: "Type tag and get random message",
    guide: "Just type: tag"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const body = event.body?.toLowerCase();

      // শুধু tag লিখলে কাজ করবে
      if (body !== "tag") return;

      // শুধু এই ছোট ছোট রিপ্লাইগুলা আসবে
      const messages = [
        "@everyone 🤬 সবাই গ্রুপে আসো 🌸",
        "@everyone 💋 চিপা থেকে বাহির হও 😹",
        "@everyone 😑 সবার চিপায় ঠান্ডা পড়ুক 🥶",
        "@everyone 😴 কে কে অনলাইনে আছো 👀",
        "@everyone 😩 সবাই একটু রেসপন্স দাও 💌",
        "@everyone 🥵 এত শান্ত কেন গ্রুপটা 😴",
        "@everyone 🎭 সবাই কোথায় গেলা 😹",
        "@everyone 🌸 গ্রুপটা জমাও সবাই ✨",
        "@everyone 💥 সবাই একবার হাজিরা দাও 😼",
        "@everyone 🌀 ভূতের মতো সিন মেরে থাকো না 👻",
        "@everyone ☄️ সবাই দ্রুত চলে আসো 🚀",
        "@everyone 🥀 গ্রুপে একটু আওয়াজ দাও 🔊",
        "@everyone 🎀 সবাই চ্যাটে নেমে পড়ো 😽",
        "@everyone 🌟 লুকিয়ে থেকো না বের হও 😹",
        "@everyone 🍁 সবাইকে ডাক দিচ্ছি চলে আসো 💫",
        "@everyone 💎 এত ভাব কিসের রে 😒",
        "@everyone 🕊️ সবাই অ্যাক্টিভ হও 🌸",
        "@everyone 🔥 আজকে গ্রুপে আগুন লাগাও 😈",
        "@everyone 🌺 সবাই রিপ্লাই দাও না হলে জরিমানা 😹",
        "@everyone ⚔️ ঘুম ভেঙে থাকলে সাড়া দাও 😴 "
      ];

      // Random message
      const randomMsg =
        messages[Math.floor(Math.random() * messages.length)];

      api.sendMessage(
        randomMsg,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      api.sendMessage(
        "❌ Error: " + err.message,
        event.threadID,
        event.messageID
      );
    }
  }
};
