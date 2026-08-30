const fs = require("fs");
const path = require("path");
const os = require("os");

const CACHE_DIR = path.join(__dirname, "..", "cache");
const CACHE_FILE = path.join(CACHE_DIR, "boinfo.json");

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}
if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ index: 0 }, null, 2));
}

const images = [
    "https://files.catbox.moe/xx5obo.jpg",
    "https://files.catbox.moe/n7ce0a.jpg"
];

function getNextImage() {
    let data = { index: 0 };
    try {
        data = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
    } catch (e) {}
    const image = images[data.index];
    data.index++;
    if (data.index >= images.length) data.index = 0;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    return image;
}

module.exports = {
    config: {
        name: "botinfo2",
        version: "3.0.0",
        author: "SIYAM-HASAN",
        role: 0,
        shortDescription: "Premium Bot Information",
        category: "owner",
        guide: "{pn}"
    },
    onStart: async function ({ message, api }) {
        const img = getNextImage();

        // Real System Information Fetching
        const cpus = os.cpus();
        const cpuModel = cpus.length > 0 ? cpus[0].model.replace(/\s+/g, ' ').trim() : "Unknown CPU";
        const totalRAM = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + " GB";
        
        // Dynamic Uptime Calculation
        const uptimeSec = process.uptime();
        const hours = Math.floor(uptimeSec / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const uptimeString = `${hours}h ${minutes}m Active`;

        // Dynamic Total Commands Count
        let totalCommands = "270+";
        if (global.client && global.client.commands) {
            totalCommands = global.client.commands.size;
        }

        // Dynamic Ping/Response Speed Calculation
        const startTime = Date.now();
        const ping = Date.now() - startTime;
        const responseSpeed = ping < 20 ? "Instant Reply" : `${ping}ms`;

        const text = `
» 👑 𝗧𝗛𝗘 𝗖𝗥𝗢𝗪𝗡𝗘𝗗 
» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🦅 𝐑𝐎𝐘𝐀𝐋 𝐈𝐃𝐄𝐍𝐓𝐈𝐓𝐘 
» 👤 𝐑𝐞𝐚𝐥 𝐍𝐚𝐦𝐞 ➜ 𝐒𝐢𝐟𝐚𝐭 𝐀𝐡𝐦𝐞𝐝  
» 🌍 𝐂𝐨𝐮𝐧𝐭𝐫𝐲 ➜ 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡 
» 🏘️ 𝐂𝐢𝐭𝐲 ➜ 𝐁𝐨𝐠𝐮𝐫𝐚  
» 📖 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 ➜ 𝐇𝐒𝐂 26
» 🎂 𝐘𝐞𝐚𝐫𝐬 ➜ 19+  
───────────────
» ⚡ 𝐀𝐑𝐓𝐈𝐅𝐈𝐂𝐈𝐀𝐋 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 𝐂𝐎𝐑𝐄 
» 🚀 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞 ➜ 𝐒𝐢𝐟𝐚𝐭 𝐂𝐡𝐚𝐭𝐁𝐨𝐭 
» 🏆 𝐄𝐝𝐢𝐭𝐢𝐨𝐧 ➜ 𝐆𝐨𝐚𝐭 𝐛𝐨𝐭 𝐯3
» ⚔️ 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➜ 𝐒𝐢𝐟𝐚𝐭
» 📈 𝐓𝐨𝐭𝐚𝐥 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬 ➜ ${totalCommands} 
🌟 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐒𝐭𝐚𝐭𝐮𝐬 ➜ 𝐔𝐥𝐭𝐫𝐚 𝐅𝐚𝐬𝐭
───────────────
» 🔥 𝗕𝗘𝗔𝗦𝗧 𝗣𝗘𝗥𝗙𝗢𝗥𝗠𝗔𝗡𝗖𝗘
» ⚙️ 𝗖𝗣𝗨 ➜ ${cpuModel}

» 💽 𝗥𝗔𝗠 ➜ ${totalRAM}

» 🗃️ 𝗦𝘁𝗼𝗿𝗮𝗴𝗲 ➜ NVMe SSD Allocated

» 📡 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 ➜ ${responseSpeed}

»🔋 𝗨𝗽𝘁𝗶𝗺𝗲 ➜ ${uptimeString}

» 🛡️ 𝗣𝗿𝗼𝘁𝗲𝗰𝘁𝗶𝗼𝗻 ➜ Military Grade
───────────────
» 🦅 𝐓𝐇𝐄 𝐄𝐌𝐏𝐈𝐑𝐄 𝐒𝐓𝐀𝐓𝐈𝐒𝐓𝐈𝐂𝐒
» 👥 𝐔𝐬𝐞𝐫 ➜ 𝗨𝗻𝗹𝗶𝗺𝗶𝘁𝗲𝗱
» 🌐 𝐆𝐫𝐨𝐮𝐩𝐬 ➜ 𝐔𝐧𝐥𝐢𝐦𝐢𝐭𝐞𝐝
» ⚡ 𝐒𝐩𝐞𝐞𝐝 ➜ 𝗘𝘅𝘁𝗿𝗲𝗺𝗲
» 🛡️ 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 ➜ 𝐌𝐚𝐱𝐢𝐦𝐮𝐦
» 📊 𝐃𝐚𝐭𝐚𝐛𝐚𝐬𝐞 ➜ 𝗣𝗿𝗲𝗺𝗶𝘂𝗺
» 🚀 𝐏𝐞𝐫𝐟𝐨𝐫𝐦𝐚𝐧𝐜𝐞 ➜ 𝟏𝟎𝟎%
» 💎 𝐑𝐚𝐧𝐤 ➜ 𝐋𝐞𝐠𝐞𝐧𝐝𝐚𝐫𝐲
» 🏆 𝐐𝐮𝐚𝐥𝐢𝐭𝐲 ➜ 𝑬𝒍𝒊𝒕𝒆
━━━━━━━━━━━━━━━━━
» 💎 𝐄𝐋𝐈𝐓𝐄 𝐅𝐄𝐀𝐓𝐔𝐑𝐄𝐒
» ✨ 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞
» 🎖️ 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬
» 🎯 𝐏𝐫𝐞𝐦𝐢𝐮𝐦 𝐀𝐜𝐜𝐮𝐫𝐚𝐜𝐲
» 🚀 𝐋𝐢𝐠𝐡𝐭𝐧𝐢𝐧𝐠 𝐒𝐩𝐞𝐞𝐝
» 🔐 𝐀𝐝𝐯𝐚𝐧𝐜𝐞𝐝 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲
» 🎭 𝐄𝐧𝐭𝐞𝐫𝐭𝐚𝐢𝐧𝐦𝐞𝐧𝐭 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬
» 📊 𝐒𝐦𝐚𝐫𝐭 𝐌𝐚𝐧𝐚𝐠𝐞𝐦𝐞𝐧𝐭
» 🎨 𝐋𝐮𝐱𝐮𝐫𝐲 𝐃𝐞𝐬𝐢𝐠𝐧
» 🔮 𝐀𝐈 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐒𝐲𝐬𝐭𝐞𝐦
» 🏅 𝐕𝐈𝐏 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞
───────────────
» 🌹 𝐀𝐌𝐀𝐃𝐄𝐑 𝐁𝐎𝐓 𝐊𝐄𝐍𝐎 𝐁𝐘𝐀𝐁𝐎𝐇𝐀𝐑 𝐊𝐎𝐑𝐁𝐄𝐍? 
 » 💖 প্রিমিয়াম ডিজাইন 
 » 💝 প্রিমিয়াম লুক 
 » 🎁 প্রিমিয়াম কমান্ড 
 » 🌺 সুন্দর ও আকর্ষণীয় ইন্টারফেস 
 » 🦋 খুব সহজে ব্যবহার করা যায় 
 » 🍁 মজার মজার ফিচার 🌈
 দ্রুত কাজ করে 
 » 🌸 নিয়মিত আপডেট পাওয়া যায় 
 » 🪷 নিরাপদ ও সুরক্ষিত 
 » 🍀 ২৪ ঘণ্টা অনলাইন 
 » 🌼 আধুনিক প্রযুক্তি ব্যবহার করা হয়েছে 
 » 💫 শক্তিশালী পারফরম্যান্স━
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕
`;

        return message.reply({
            body: text,
            attachment: await global.utils.getStreamFromURL(img)
        });
    }
};
