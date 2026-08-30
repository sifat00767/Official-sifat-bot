// cmdstore.js

const axios = require("axios");

const availableCmdsUrl =
  "https://raw.githubusercontent.com/mahmudx7/HINATA/main/CMDSRUL.json";

const cmdUrlsJson =
  "https://raw.githubusercontent.com/mahmudx7/HINATA/main/CMDS.json";

const ITEMS_PER_PAGE = 10;

module.exports = {
  config: {
    name: "cmdstore2",
    aliases: ["cmds", "cs"],
    version: "2.0",
    author: "Siyam Hasan",
    role: 0,

    description: {
      en: "Commands Store of Siyam Hasan",
      bn: "সিয়াম হাসানের কমান্ড স্টোর",
      vi: "Cửa hàng lệnh của Siyam Hasan"
    },

    category: "general",
    countDown: 3,

    guide: {
      en: "{pn} [name/page/char]",
      bn: "{pn} [নাম/পেজ/অক্ষর]",
      vi: "{pn} [tên/trang/ký tự]"
    }
  },

  langs: {

    bn: {
      noCmd:
        "❌ | \"%1\" নামে কোনো কমান্ড খুঁজে পাইনি।",

      invalidPage:
        "❌ | ভুল পেজ নাম্বার। ১ থেকে %1 এর মধ্যে লিখুন।",

      error:
        "❌ | সমস্যা হয়েছে: %1",

      replyError:
        "❌ | এটা আপনার রিপ্লাই না।",

      choose:
        "নাম্বার রিপ্লাই দিয়ে কমান্ডের URL দেখুন।"
    },

    en: {
      noCmd:
        "❌ | No commands found for \"%1\".",

      invalidPage:
        "❌ | Invalid page number. Enter between 1 and %1.",

      error:
        "❌ | Error: %1",

      replyError:
        "❌ | This is not your reply.",

      choose:
        "Reply with a number to see command URL."
    },

    vi: {
      noCmd:
        "❌ | Không tìm thấy lệnh \"%1\".",

      invalidPage:
        "❌ | Số trang không hợp lệ. Từ 1 đến %1.",

      error:
        "❌ | Lỗi: %1",

      replyError:
        "❌ | Đây không phải phản hồi của bạn.",

      choose:
        "Reply số để xem URL lệnh."
    }
  },

  onStart: async function ({
    api,
    event,
    args,
    getLang
  }) {

    const {
      threadID,
      messageID,
      senderID
    } = event;

    const query =
      args.join(" ").trim().toLowerCase();

    try {

      api.setMessageReaction(
        "⏳",
        messageID,
        () => {},
        true
      );

      const response =
        await axios.get(availableCmdsUrl);

      let cmds = response.data.cmdName;

      let finalArray = cmds;

      let page = 1;

      // Search System
      if (query) {

        if (!isNaN(query)) {

          page = parseInt(query);

        } else if (query.length === 1) {

          finalArray = cmds.filter(cmd =>
            cmd.cmd
              .toLowerCase()
              .startsWith(query)
          );

        } else {

          finalArray = cmds.filter(cmd =>
            cmd.cmd
              .toLowerCase()
              .includes(query)
          );
        }
      }

      // No Result
      if (finalArray.length === 0) {

        api.setMessageReaction(
          "❌",
          messageID,
          () => {},
          true
        );

        return api.sendMessage(
          getLang("noCmd", query),
          threadID,
          messageID
        );
      }

      // Pagination
      const totalPages =
        Math.ceil(
          finalArray.length /
          ITEMS_PER_PAGE
        );

      if (
        page < 1 ||
        page > totalPages
      ) {

        return api.sendMessage(
          getLang(
            "invalidPage",
            totalPages
          ),
          threadID,
          messageID
        );
      }

      const startIndex =
        (page - 1) *
        ITEMS_PER_PAGE;

      const cmdsToShow =
        finalArray.slice(
          startIndex,
          startIndex +
          ITEMS_PER_PAGE
        );

      // Message Design
      let msg =
`╭─❍ 𝐂𝐌𝐃 𝐒𝐓𝐎𝐑𝐄 🎀
├─👑 Admin: SIFAT AHMED
├─📦 Total Commands: ${finalArray.length}
├─📄 Page: ${page}/${totalPages}
╰────────────◊

`;

      cmdsToShow.forEach((cmd, index) => {

        msg +=
`╭─❍ ${startIndex + index + 1}. ${cmd.cmd}
├─👤 Author: Siyam Hasan
├─🗓 Update: ${cmd.update}
╰────────────◊

`;
      });

      msg +=
`💬 ${getLang("choose")}`;

      api.sendMessage(

        msg,

        threadID,

        (error, info) => {

          if (!error) {

            api.setMessageReaction(
              "✅",
              messageID,
              () => {},
              true
            );

            global.GoatBot.onReply.set(
              info.messageID,
              {
                commandName:
                  this.config.name,

                messageID:
                  info.messageID,

                author:
                  senderID,

                cmdName:
                  finalArray,

                page:
                  page
              }
            );
          }
        },

        messageID
      );

    } catch (error) {

      api.setMessageReaction(
        "❌",
        messageID,
        () => {},
        true
      );

      api.sendMessage(
        getLang(
          "error",
          error.message
        ),
        threadID,
        messageID
      );
    }
  },

  onReply: async function ({
    api,
    event,
    Reply,
    getLang
  }) {

    if (
      Reply.author !=
      event.senderID
    ) {

      return api.sendMessage(
        getLang("replyError"),
        event.threadID,
        event.messageID
      );
    }

    const reply =
      parseInt(event.body);

    const startIndex =
      (Reply.page - 1) *
      ITEMS_PER_PAGE;

    const totalInPage =
      Math.min(
        startIndex +
        ITEMS_PER_PAGE,
        Reply.cmdName.length
      );

    if (
      isNaN(reply) ||
      reply <
      startIndex + 1 ||
      reply > totalInPage
    ) {
      return;
    }

    try {

      api.setMessageReaction(
        "⌛",
        event.messageID,
        () => {},
        true
      );

      const cmdName =
        Reply.cmdName[
          reply - 1
        ].cmd;

      const response =
        await axios.get(
          cmdUrlsJson
        );

      const selectedCmdUrl =
        response.data[
          cmdName
        ];

      if (!selectedCmdUrl) {

        return api.sendMessage(
          "❌ | URL Not Found",
          event.threadID,
          event.messageID
        );
      }

      api.unsendMessage(
        Reply.messageID
      );

      const msg =
`╭─❍ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎
├─📌 Name: ${cmdName}
├─👑 Owner: SIFAT AHMED
├─🔗 URL:
${selectedCmdUrl}
╰────────────◊`;

      api.sendMessage(

        msg,

        event.threadID,

        () => {

          api.setMessageReaction(
            "✅",
            event.messageID,
            () => {},
            true
          );
        },

        event.messageID
      );

    } catch (error) {

      api.sendMessage(
        getLang(
          "error",
          error.message
        ),
        event.threadID,
        event.messageID
      );
    }
  }
};
