const axios = require("axios");

module.exports = {
config: {
name: "accept",
aliases: ['acp', 'requests'],
version: "6.0.0",
author: "Siyam",
countDown: 5,
role: 0,
shortDescription: "Accept sender's friend request with status check",
longDescription: "Accepts sender's request or notifies if already friends.",
category: "Utility",
},

onStart: async function ({ event, api, usersData }) {
const { threadID, messageID, senderID } = event;
const name = await usersData.getName(senderID);

try {
// 1. Check Friend Status (Already friends or not)
const userInfo = await api.getUserInfo(senderID);
const isFriend = userInfo[senderID].isFriend;

if (isFriend) {
return api.sendMessage(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🌸 হ্যালো ${name} !
» 🤝 তুমি আগেই আমার
» 💖 Friend List এ আছো
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`, 
threadID, messageID);
}

// 2. Fetch Pending Requests List
const formList = {
av: api.getCurrentUserID(),
fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
fb_api_caller_class: "Siyam",
doc_id: "61568411310748",
variables: JSON.stringify({ input: { scale: 3 } })
};

const response = await api.httpPost("https://www.facebook.com/api/graphql/", formList);
const listRequest = JSON.parse(response).data.viewer.friending_possibilities.edges;

// 3. Check if sender is in pending list
const senderRequest = listRequest.find(u => u.node.id == senderID);

if (!senderRequest) {
return api.sendMessage(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🌸 হেই ${name} !
» ⚠️ তোমার কোনো
» 📥 Pending Request পাইনি
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`, 
threadID, messageID);
}

// 4. Accept the specific request
const formAccept = {
av: api.getCurrentUserID(),
fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
fb_api_caller_class: "Siyam",
doc_id: "61584641872032",
variables: JSON.stringify({
input: {
source: "friends_tab",
friend_requester_id: senderID,
actor_id: api.getCurrentUserID(),
client_mutation_id: Math.round(Math.random() * 19).toString()
},
scale: 3,
refresh_num: 0
})
};

const res = await api.httpPost("https://www.facebook.com/api/graphql/", formAccept);

if (JSON.parse(res).errors) {
return api.sendMessage(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 😔  সরি ${name}
» ⚠️ তোমার Request টি
» ❌ Accept করতে পারিনি
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`, 
threadID, messageID);
} else {
return api.sendMessage(
`» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡
───────────────
» 🎉 অভিনন্দন ${name}!
» ✔️ তোমার Friend Request
» সফলভাবে Accept করা হয়েছে।
───────────────
» _⁠-𝑵𝒊𝒋𝒉𝒖𝒎 𝑪𝒉𝒂𝒕𝑩𝒐𝒕`, 
threadID, messageID);
}

} catch (err) {
console.error(err);
return api.sendMessage("❌ System Error! Please try again later.", threadID, messageID);
}
}
};
