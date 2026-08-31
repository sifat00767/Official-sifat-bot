module.exports = {
  config: {
    name: "out",
    version: "2.0",
    author: "FARHAN-KHAN",
    countDown: 5,
    role: 2,
    shortDescription: "বটকে গ্রুপ থেকে বের করে দেওয়া",
    longDescription: "এই কমান্ডের মাধ্যমে বটকে বর্তমান বা নির্দিষ্ট গ্রুপ থেকে বের করে দেওয়া হয়।",
    category: "owner",
    guide: {
      en: "{pn} [threadID (optional)]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const botID = api.getCurrentUserID();
    const targetThread = args[0] || event.threadID;

    // 🔥 REAL TIME DATE & TIME (LIVE)
    const now = new Date();

    const date = now.toLocaleDateString("en-GB", {
      timeZone: "Asia/Dhaka"
    });

    const time = now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    const message = `
@everyone আমার এডমিন এর আদেশে আমি বের হয়ে যাচ্ছি...!! 
😓💔 তোমাদের সবাই কে অনেক মিস করবো...!! আল্লাহ হাফেজ
`;

    try {
      await api.sendMessage(message, targetThread);
      await api.removeUserFromGroup(botID, targetThread);
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        "❌ বের হতে পারলাম না! হয়তো আমি অ্যাডমিন না বা কোনো সমস্যা হয়েছে।",
        event.threadID
      );
    }
  },
};
