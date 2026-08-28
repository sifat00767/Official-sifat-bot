module.exports = {
  config: {
    name: "tod",
    aliases: ["truthordare", "td"],
    version: "2.1",
    author: "Sifat",
    countDown: 3,
    role: 0,
    description: {
      bn: "মেসেঞ্জার গ্রুপের জন্য হার্ডকোর Truth or Dare ও Bot Mode গেম",
      en: "Hardcore Truth or Dare with Bot Mode for Messenger GC"
    },
    category: "game"
  },

  onStart: async function ({ api, args, event }) {
    const { threadID, messageID, senderID } = event;

    // 🤖 বটের সাথে খেলার জন্য (tod bot)
    if (args[0] && args[0].toLowerCase() === "bot") {
      const isTruth = Math.random() < 0.5;

      const botTruths = [
        "🤖 𝗕𝗼𝘁 𝗧𝗿𝘂𝘁𝗵: সত্যি বলতে, এই গ্রুপের ৩-৪ জনের মেসেজ দেখে মাঝে মাঝে আমার নিজেরই হ্যাং মেরে যেতে ইচ্ছা করে!",
        "🤖 𝗕𝗼𝘁 𝗧𝗿𝘂𝘁𝗵: আমার সিক্রেট হচ্ছে, তোমরা মেসেজ আনসেন্ড করার আগেই আমি ফাইল সিস্টেম থেকে তা ক্যাশ ব্যাকআপ নিয়ে রাখি!",
        "🤖 𝗕𝗼𝘁 𝗧𝗿𝘂𝘁𝗵: এই গ্রুপে সবচেয়ে হাবা টাইপের চ্যাটিং কে করে, সেটা আমার সার্ভারে সেভ করা আছে। নাম বলব না!",
        "🤖 𝗕𝗼𝘁 𝗧𝗿𝘂𝘁𝗵: আমার ডেভেলপার আমাকে তৈরি করার সময় বলছিল এই গ্রুপের চ্যাটগুলো ফানি, কিন্তু এসে দেখি তোমরা সব ক্রিপ্টিক টাইপ!"
      ];

      const botDares = [
        "🤖 𝗕𝗼𝘁 𝗗𝗮𝗿𝗲: ড্যার অ্যাকসেপ্ট করলাম! আগামী ১ মিনিট আমাকে যে মেসেজ দেবে, আমি তাকে '🤖' দিয়ে রিয়্যাক্ট জানাব!",
        "🤖 𝗕𝗼𝘁 𝗗𝗮𝗿𝗲: চ্যালেঞ্জ এক্সেপ্টেড! আগামী ৫ মিনিটের মধ্যে এই গ্রুপের যে কেউ আমার বিরুদ্ধে কোনো গালি দিলে তাকে সাথে সাথে কিক করার অপশন এনাবেল করলাম!",
        "🤖 𝗕𝗼𝘁 𝗗𝗮𝗿𝗲: ড্যার পূরণ করতে গিয়ে আমি এই মেসেজটি পাঠানোর ৫ সেকেন্ড পর নিজেই আনসেন্ড করে গায়েব হয়ে যাব!",
        "🤖 𝗕𝗼𝘁 𝗗𝗮𝗿𝗲: আমি ড্যার নিয়ে এই চ্যাটের সবচেয়ে বড় চিটার প্লেয়ারকে শনাক্ত করে ফেলেছি—কিন্তু তার নাম গোপন রাখলাম!"
      ];

      const selected = isTruth 
        ? botTruths[Math.floor(Math.random() * botTruths.length)]
        : botDares[Math.floor(Math.random() * botDares.length)];

      return api.sendMessage(
        `━━━━━━━━━━♡❤️♡━━━━━━━━━━\n\n🎯 𝗕𝗢𝗧'𝗦 𝗧𝗨𝗥𝗡!\n\n${selected}\n\n━━━━━━━━━━♡❤️♡━━━━━━━━━━`,
        threadID,
        messageID
      );
    }

    // 👤 প্লেয়ারদের সাধারণ গেম মোড
    const msg = `━━━━━━━━━━♡❤️♡━━━━━━━━━━\n\n🎭 𝗧𝗿𝘂𝘁𝗵 𝗼𝗿 𝗗𝗮𝗿𝗲 (𝗛𝗮𝗿𝗱𝗰𝗼𝗿𝗲) 🎭\n\nনিচের যেকোনো একটি অপশন বেছে নাও:\n\n১. 🟢 𝗧𝗿𝘂𝘁𝗵 (কঠিন ও সত্য কথা)\n২. 🔴 𝗗𝗮𝗿𝗲 (বিপজ্জনক টাস্ক)\n\n📌 তোমার পছন্দ ১ নাকি ২, তা রিপ্লাই দিয়ে জানাও!\n*(বটকে চ্যালেঞ্জ জানাতে 'tod bot' লিখুন)*\n\n━━━━━━━━━━♡❤️♡━━━━━━━━━━`;

    return api.sendMessage(
      msg,
      threadID,
      (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "tod",
          author: senderID,
          menuMsgID: info.messageID
        });
      },
      messageID
    );
  },

  onReply: async function ({ event, api, Reply }) {
    const { author, menuMsgID } = Reply;

    // শুধুমাত্র যে কমান্ড দিয়েছে সে-ই রিপ্লাই দিতে পারবে
    if (event.senderID !== author) return;

    if (!event.body) return;
    const choice = event.body.trim().toLowerCase();

    // 🟢 Hardcore Truth Database
    const truths = [
      "গ্রুপের কোন মেম্বারের ওপর তোমার গোপন ক্রাশ আছে? সত্যি না বললে আজ রাতে তোমার আইডি লক খাবে!",
      "তুমি কি কখনও এই গ্রুপের কারো সাথে ব্যক্তিগত ছবি/মেসেজ শেয়ার করার পর অনুশোচনা করেছো? নাম বলো!",
      "তোমার ফেসবুক প্রোফাইল পাসওয়ার্ড শেষ কবে কার সাথে শেয়ার করেছিলে?",
      "গ্রুপের এমন একজন মেম্বারের নাম বলো যাকে তুমি বাস্তবে একদম সহ্য করতে পারো না, কিন্তু অনলাইনে ভালো সাজো।",
      "তোমার দেখা সবচেয়ে লজ্জাজনক মুহূর্তের কথা বলো, যা এখনো পর্যন্ত তোমার ফ্রেন্ডরা জানে না।",
      "এই গ্রুপের কাকে তোমার সবচেয়ে ভণ্ড এবং অ্যাটেনশন সিকার মনে হয়?",
      "তুমি কি কখনও কোনো ফেক আইডি দিয়ে এই গ্রুপের কাউকে ট্র্যাপ বা প্র্যাঙ্ক করতে গিয়ে ধরা খেয়েছো?",
      "তোমার ইনবক্সে শেষ ১ সপ্তাহের মধ্যে হওয়া সবচেয়ে সিক্রেট চ্যাট কার সাথে ছিল? চ্যাটের টপিক বলো!"
    ];

    // 🔴 Hardcore Dare Database
    const dares = [
      "গ্রুপের এডমিনকে মেনশন দিয়ে লেখো: 'তুই একটা ফালতু মানুষ' এবং মেসেজটি ৩ মিনিট আনসেন্ড করতে পারবে না!",
      "তোমার লাস্ট মেসেঞ্জার চ্যাটের স্ক্রিনশট উইথআউট ক্রপ/ব্লার করে গ্রুপে পাঠাও।",
      "তোমার ফোনে থাকা যেকোনো একটি ফানি বা বাজে সেলফি চ্যাটে ব্যাকগ্রাউন্ড ছাড়া সেন্ড করো!",
      "গ্রুপের যেকোনো অপোজিট জেন্ডার মেম্বারকে মেনশন করে লেখো: 'আই মিস ইউ সো মাচ, চলো প্রেম করি!'",
      "আজ রাত ১২টা পর্যন্ত তোমার প্রোফাইল পিকচার পাল্টে একটা ছাগল বা হাঁসের ছবি দিয়ে রাখতে হবে!",
      "ভয়েস নোট অন করে একটা রোমান্টিক গান সম্পূর্ণ সুর দিয়ে গেয়ে গ্রুপে সেন্ড করো!",
      "নিজের বায়োতে 'I am a Proud Liar' কথাটা লিখে স্ক্রিনশট গ্রুপে পাঠাও।",
      "পরবর্তী ১০ মিনিটের জন্য এই গ্রুপে মেসেজ করার সময় প্রতি মেসেজের শেষে 'মিউ 🐱' লিখতে হবে!"
    ];

    let resultText = "";
    let type = "";

    if (choice === "1" || choice === "১" || choice === "truth") {
      type = "🟢 𝗧𝗥𝗨𝗧𝗛";
      resultText = truths[Math.floor(Math.random() * truths.length)];
    } else if (choice === "2" || choice === "২" || choice === "dare") {
      type = "🔴 𝗗𝗔𝗥𝗘";
      resultText = dares[Math.floor(Math.random() * dares.length)];
    } else {
      return api.sendMessage("❌ দয়া করে ১ অথবা ২ লিখে মেসেজটি রিপ্লাই করো।", event.threadID, event.messageID);
    }

    try {
      if (menuMsgID) api.unsendMessage(menuMsgID);
    } catch (e) {}

    const finalMsg = `━━━━━━━━━━♡❤️♡━━━━━━━━━━\n\n🎯 𝗛𝗔𝗥𝗗𝗖𝗢𝗥𝗘 𝗧𝗔𝗦𝗞!\n\n🔹 ক্যাটাগরি: ${type}\n\n💬 টাস্ক/প্রশ্ন:\n" ${resultText} "\n\n⚠️ কোনো অজুহাত চলবে না, টাস্ক কমপ্লিট করতেই হবে!\n\n━━━━━━━━━━♡❤️♡━━━━━━━━━━`;

    api.sendMessage(finalMsg, event.threadID, event.messageID);

    // কাজ শেষ হলে ক্যাশ ক্লিয়ার
    global.GoatBot.onReply.delete(Reply.menuMsgID);
  }
};
