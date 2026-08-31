if (!global.__GroupLockSystem) global.__GroupLockSystem = new Map();
if (!global.__GroupLockWarn) global.__GroupLockWarn = new Map();
if (!global.__GroupLockSpam) global.__GroupLockSpam = new Map();

module.exports = {
  config: {
    name: "grouplock",
    aliases: ["lock", "lockbox"],
    version: "11.0.0",
    author: "SIYAM HASAN",
    role: 0,
    shortDescription: "Turn on/off message lock guard for specific groups.",
    longDescription: "Allows admins to lock a specific group. Automatically warns and kicks regular members who text while locked.",
    category: "box-protection",
    guide: { en: "{pn} on | off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, senderID } = event;
    const sID = String(senderID);

    try {
      const botAdmins = global.GoatBot?.config?.adminBot || [];
      const info = await api.getThreadInfo(threadID);
      const groupAdmins = info.adminIDs.map(i => String(i.id));

      const isBotAdmin = botAdmins.map(id => String(id)).includes(sID);
      const isGroupAdmin = groupAdmins.includes(sID);

      if (!isBotAdmin && !isGroupAdmin) {
        return message.reply("❌ এই কমান্ডটি শুধুমাত্র এডমিন এর জন্য🫶 তুই গরিব🥱 তোর কথা শুনবো না🌝 গরিবের দল 😁☹️!");
      }

      const status = args[0]?.toLowerCase();

      if (status === "on") {
        global.__GroupLockSystem.set(threadID, true);
        return message.reply("🔒 এই গ্রুপের সিকিউরিটি গার্ড অন করা হয়েছে🛡️। এখন থেকে মেসেজ দেওয়া সাথে সাথে কিক ফ্রি 🤣!");
      } 
      
      if (status === "off") {
        global.__GroupLockSystem.delete(threadID);
        global.__GroupLockWarn.forEach((val, key) => {
          if (key.startsWith(`${threadID}_`)) global.__GroupLockWarn.delete(key);
        });
        return message.reply("এডমিন 🔓 এই গ্রুপের আন লক করা হয়েছে🛸। এখন সবাই মেসেজ করতে পারবেন।🌝");
      }

      return message.reply("⚠️ এডমিন এইভাবে ব্যবহার করো:\n• লক করতে: ,grouplock on\n• লক খুলতে: ,grouplock off");

    } catch (err) {
      console.error(err);
    }
  },

  onChat: async function ({ api, event }) {
    const { threadID, senderID, messageID } = event;
    if (!senderID || senderID == api.getCurrentUserID()) return;

    if (!global.__GroupLockSystem.get(threadID)) return;

    try {
      const sID = String(senderID);

      // ১. সিকিউরিটি হোয়াইটলিস্ট চেক (বট ও গ্রুপ এডমিনদের জন্য ছাড়)
      const botAdmins = global.GoatBot?.config?.adminBot || [];
      if (botAdmins.map(id => String(id)).includes(sID)) return;

      const info = await api.getThreadInfo(threadID);
      const groupAdmins = info.adminIDs.map(i => String(i.id));
      if (groupAdmins.includes(sID)) return;

      // ২. অ্যান্টি-স্প্যাম মেকানিজম (এক মেসেজ দুইবার আসা বা বট ক্র্যাশ করা রোধ করতে)
      const spamKey = `${threadID}_${sID}`;
      const lastCheck = global.__GroupLockSpam.get(spamKey) || 0;
      if (Date.now() - lastCheck < 1500) return; 
      global.__GroupLockSpam.set(spamKey, Date.now());

      // ৩. সাধারণ মেম্বারের মেসেজ রিমুভ করা
      try {
        await api.unsendMessage(messageID);
      } catch (e) {}

      // ৪. ওয়ার্নিং কাউন্টার ট্র্যাকিং
      const userKey = `${threadID}_${sID}`;
      let warnCount = global.__GroupLockWarn.get(userKey) || 0;
      warnCount++;
      global.__GroupLockWarn.set(userKey, warnCount);

      let userData = await api.getUserInfo(sID);
      let userName = (userData[sID]?.name || "গ্রুপ মেম্বার").toUpperCase();

      // ৫. অ্যাকশন ইঞ্জিন (৩ বারের বেশি হলে কিক, অন্যথায় ওয়ার্নিং)
      if (warnCount > 3) {
        global.__GroupLockWarn.delete(userKey);

        let kickMsg = `_⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n`;
        kickMsg += `───────────────────\n`;
        kickMsg += `⚠️ 𝗚𝗥𝗢𝗨𝗣 𝗟𝗢𝗖𝗞𝗘𝗗 ⚠️\n\n`;
        kickMsg += `👤 : @${userName}\n`;
        kickMsg += `🚫 : ৩ বার ওয়ার্নিং পাওয়ার পরও মেসেজ দিয়েছেন\n`;
        kickMsg += `⚙️ : এডমিন এর আদেশ না মানার কারণে 😬তোকে গ্রুপ থেকে 🦵লাথি দিয়ে সম্মানের সহিত বাহির করা হলো 🥱\n`;
        kickMsg += `───────────────────\n`;
        kickMsg += `_⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;

        await api.sendMessage({
          body: kickMsg,
          mentions: [{ tag: `@${userName}`, id: sID }]
        }, threadID);

        return api.removeUserFromGroup(sID, threadID);

      } else {
        let remain = 4 - warnCount;
        
        let warnMsg = `_⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡\n`;
        warnMsg += `───────────────────\n`;
        warnMsg += `🔒 𝗚𝗥𝗢𝗨𝗣 𝗟𝗢𝗖𝗞𝗘𝗗 🔒\n\n`;
        warnMsg += `👤 : @${userName}\n`;
        warnMsg += `📢 : এখন থেকে গ্রুপ লক যে মেসেজ দিবে তাকে 🛡️ সিয়াম ভাই এর 🛸 আদেশে 🥱 অটোমেটিক কিক দেওয়া হবে\n\n`;
        warnMsg += `⚠️ : [ ${warnCount} / ৩ ]\n`;
        warnMsg += `🚨 : আর মাত্র ${remain} বার সুযোগ আছে 🤧 প্রিয় 🫶, এরপর কিক খাবেন!\n`;
        warnMsg += `───────────────────\n`;
        warnMsg += `_⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`;

        return api.sendMessage({
          body: warnMsg,
          mentions: [{ tag: `@${userName}`, id: sID }]
        }, threadID);
      }

    } catch (err) {
      console.error("Lock System Error:", err);
    }
  }
};
