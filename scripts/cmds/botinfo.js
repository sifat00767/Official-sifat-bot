const { commands } = global.GoatBot;
const axios = require("axios");
const moment = require("moment-timezone");
const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = {
	config: {
		name: "botinfo",
		aliases: ["botinf", "infobot", "binfo"],
		version: "2.0",
		author: "MR.AYAN",
		countDown: 5,
		role: 0,
		category: "info",
		shortDescription: {
			en: "Bot information"
		},
		longDescription: {
			en: "Get bot and system information"
		},
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function ({ message, event, api, threadsData }) {
		try {

			const timeStart = Date.now();

			const threadData = await threadsData.get(event.threadID) || {};
			const ping = Date.now() - timeStart;

			const now = moment().tz("Asia/Dhaka");
			const date = now.format("MMMM DD YYYY");
			const time = now.format("h:mm:ss A");

			const boxPrefix = global.utils.getPrefix(event.threadID);

			const uptime = process.uptime();
			const botUptime = formatMilliseconds(uptime * 1000);

			const totalMemory = os.totalmem();
			const freeMemory = os.freemem();

			const diskUsage = await getDiskUsage();

			const systemInfo = {
				os: `${os.type()} ${os.release()}`,
				arch: os.arch(),
				cpu: `${os.cpus()[0].model} (${os.cpus().length} cores)`,
				botUptime,
				serverUptime: formatUptime(os.uptime())
			};

			let speed = "N/A";

			try {
				const FastSpeedtest = require("fast-speedtest-api");

				const speedTest = new FastSpeedtest({
					token: "fast",
					verbose: false,
					timeout: 10000,
					https: true,
					urlCount: 5,
					bufferSize: 8,
					unit: FastSpeedtest.UNITS.Mbps
				});

				speed = await speedTest.getSpeed();
				speed = Number(speed).toFixed(2);
			}
			catch (e) {
				speed = "N/A";
			}

			const info = {
				name: global.GoatBot.config.nickNameBot || "GoatBot",
				prefix: global.GoatBot.config.prefix,
				boxPrefix,
				threadName: threadData.threadName || "Unknown Group",
				author: global.GoatBot.config.authorName || "Unknown"
			};

			let attachment;

			try {
				const { data } = await axios.get(
					"https://api.waifu.pics/sfw/waifu"
				);

				attachment = await global.utils.getStreamFromURL(data.url);
			}
			catch (e) {
				attachment = null;
			}

			await message.reply({
				body: `
━━━━━━━━━━━━━━━━━━━
🚀 | BOT INFORMATION
━━━━━━━━━━━━━━━━━━━

☂ | BOT NAME: ${info.name}
☂ | BOT PREFIX: ${info.prefix}
☂ | BOX PREFIX: ${info.boxPrefix}
☂ | BOT PING: ${ping}ms
☂ | BOT UPTIME: ${systemInfo.botUptime}
☂ | TOTAL COMMANDS: ${commands.size}
☂ | GROUP NAME: ${info.threadName}

━━━━━━━━━━━━━━━━━━━
✨ | SYSTEM INFORMATION
━━━━━━━━━━━━━━━━━━━

☂ | OS: ${systemInfo.os}
☂ | ARCH: ${systemInfo.arch}
☂ | CPU: ${systemInfo.cpu}
☂ | TIME: ${time}
☂ | DATE: ${date}
☂ | SPEED: ${speed} Mbps
☂ | SERVER UPTIME: ${systemInfo.serverUptime}
☂ | RAM USAGE: ${prettyBytes(totalMemory - freeMemory)}
☂ | TOTAL RAM: ${prettyBytes(totalMemory)}
☂ | DISK USED: ${prettyBytes(diskUsage.used)}
☂ | DISK TOTAL: ${prettyBytes(diskUsage.total)}

━━━━━━━━━━━━━━━━━━━
👑 | BOT OWNER 
SIFAT AHMED
━━━━━━━━━━━━━━━━━━━

${info.author}
━━━━━━━━━━━━━━━━━━━
				`,
				attachment
			});

		}
		catch (err) {
			console.log(err);
			message.reply(`❌ Error:\n${err.message}`);
		}
	}
};

async function getDiskUsage() {
	try {
		const { stdout } = await exec("df -k /");

		const parts = stdout
			.split("\n")[1]
			.split(/\s+/)
			.filter(Boolean);

		return {
			total: parseInt(parts[1]) * 1024,
			used: parseInt(parts[2]) * 1024
		};
	}
	catch (e) {
		return {
			total: 0,
			used: 0
		};
	}
}

function formatUptime(seconds) {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	return `${days}D ${hours}H ${minutes}M ${secs}S`;
}

function formatMilliseconds(ms) {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	return `${hours}H ${minutes % 60}M ${seconds % 60}S`;
}

function prettyBytes(bytes) {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;

	while (bytes >= 1024 && i < units.length - 1) {
		bytes /= 1024;
		i++;
	}

	return `${bytes.toFixed(2)} ${units[i]}`;
          }
