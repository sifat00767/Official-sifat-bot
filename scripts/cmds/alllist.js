module.exports = {
    config: {
        name: "alllist",
        version: "1.0.0",
        author: "Siyam Hasan",
        countDown: 5,
        role: 2, // শুধুমাত্র বট অ্যাডমিন (Bot Admin Only) ব্যবহার করতে পারবে
        description: "বটের সমস্ত তথ্য এবং কমান্ডের তালিকা দেখায় (শুধুমাত্র অ্যাডমিন)",
        category: "info"
    },

    onStart: async function ({ message, args }) {
        // অতিরিক্ত কোনো অপশন বা আর্গুমেন্ট থাকলে কাজ করবে না (যেমন: ,alllist on/off বা অন্য কিছু লিখলে)
        if (args && args.length > 0) {
            return; 
        }

        const infoText = `────────────────
📊 ALL COMMANDS & BOT INFO LIST
────────────────

🤖 BOT INFO
┖ 𓆩»̶̶͓͓͓̽̽̽𝆠꯭፝֟ɴɪᴊʜᴜᴍ-ᴄʜᴀᴛ-ʙᴏᴛ𝆠꯭፝֟⚜️𓆪

👥 USERS & NICKNAMES
┠ সিফাত • সিফাত chat Bot

👑 BOT OWNER INFO
┖ নাম: সিফাত আহমেদ  • বাসা: বগুড়া • বয়স: ১৯+

📊 BOT STATUS
┠ 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ SIFAT 
┠ 🔰 𝗣𝗥𝗘𝗙𝗜𝗫 ➜ { , } • 📊 𝗧𝗢𝗧𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ➜ 700+
┠ ⚙️ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 ➜ V2 💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠
┖ 👑SIFAT👑 𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩2 • 𝟔𝟎𝟗𝟔

⚙️ BOT COMMANDS
🛠 ADMIN & SYSTEM
┖ antiInbox • police • ,wl on • ,autotimer on • ,allnoti hi • /namaz • ban • kick • protect on • autotimer on • senlock • autoseen off • botstatus • rankup on

📦 BOX & GROUP
┖ allgroup • goatstore show 16 • supportgc • allnick • cancelmarry • mentionspam

😂 FUN & ADULT
┖ ,chipay • ,chor • ,nude, • bonk • propose • love • kiss

💖 LOVE & PAIR
┖ .pair • ,pair4 • pairedit

📂 FILES & TOOLS
┖ /File uns • Voicehelp • webss • catbox • imgur • search • xray • chakrun

🖼 MEDIA & PINTEREST
┖ manga • pinterest • pinterestpro • catvideo

ℹ️ INFO & ECONOMY
┖ age 5/05/209 • ,userinfo • balance
────────────────`;

        return message.reply(infoText);
    }
};
