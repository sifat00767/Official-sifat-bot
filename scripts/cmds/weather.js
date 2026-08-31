const axios = require("axios");
const moment = require("moment-timezone");
const Canvas = require("canvas");
const fs = require("fs-extra");

Canvas.registerFont(
	__dirname + "/assets/font/BeVietnamPro-SemiBold.ttf", {
	family: "BeVietnamPro-SemiBold"
});
Canvas.registerFont(
	__dirname + "/assets/font/BeVietnamPro-Regular.ttf", {
	family: "BeVietnamPro-Regular"
});

function convertFtoC(F) {
	return Math.floor((F - 32) / 1.8);
}
function formatHours(hours) {
	return moment(hours).tz("Asia/Dhaka").format("HH:mm");
}

module.exports = {
	config: {
		name: "weather",
		version: "1.2",
		author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem dự báo thời tiết hiện tại và 5 ngày sau",
			en: "view the current and next 5 days weather forecast"
		},
		category: "ai",
		guide: {
			vi: "{pn} <địa điểm>",
			en: "{pn} <location>"
		},
		envGlobal: {
			weatherApiKey: "d7e795ae6a0d44aaa8abb1a0a7ac19e4"
		}
	},

	langs: {
		vi: {
			syntaxError: "⚠️ Vui lòng nhập địa điểm",
			notFound: "❌ Không thể tìm thấy địa điểm: %1",
			error: "❌ Đã xảy ra lỗi: %1",
			today: "🌤️ WEATHER FORECAST\n───────────────\n» 📍 LOCATION: %1\n» 📝 STATUS: %2\n» 🌡️ TEMP: %3°C - %4°C\n» 🤔 FEELS LIKE: %5°C - %6°C\n» 🌅 SUNRISE: %7 | 🌄 SUNSET: %8\n» 🌃 MOONRISE: %9 | 🏙️ MOONSET: %10\n───────────────\n» 🌞 DAY: %11\n» 🌙 NIGHT: %12\n───────────────\n» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡"
		},
		en: {
			syntaxError: `⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡\n───────────────\n» 📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲 : weather Dhaka`,
			notFound: `❌ 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n───────────────\n» 🌐 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗶𝗻𝗱 : %1`,
			error: `❌ 𝗘𝗥𝗥𝗢𝗥 𝗢𝗖𝗖𝗨𝗥𝗥𝗘𝗗\n───────────────\n» ⚠️ %1`,
			today: `🌤️ 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n───────────────\n» 📍 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡 : %1\n» 📝 𝗦𝗧𝗔𝗧𝗨𝗦 : %2\n» 🌡️ 𝗧𝗘𝗠𝗣𝗘𝗥𝗔𝗧𝗨𝗥𝗘 : %3°C - %4°C\n» 👤 𝗙𝗘𝗘𝗟𝗦 𝗟𝗜𝗞𝗘 : %5°C - %6°C\n» 🌅 𝗦𝗨𝗡𝗥𝗜𝗦𝗘 : %7  |  🌄 𝗦𝗨𝗡𝗦𝗘𝗧 : %8\n» 🌃 𝗠𝗢𝗢𝗡𝗥𝗜𝗦𝗘 : %9  |  🏙️ 𝗠𝗢𝗢𝗡𝗦𝗘𝗧 : %10\n───────────────\n» 🌞 𝗗𝗔𝗬 : %11\n» 🌙 𝗡𝗜𝗚𝗛𝗧 : %12\n───────────────\n» _⁠-𝑨𝒅𝒎𝒊𝒏 𝑺𝒊𝒇𝒂𝒕 𝑺𝒊𝒓 ♡`
		}
	},

	onStart: async function ({ args, message, envGlobal, getLang }) {
		const apikey = envGlobal.weatherApiKey;

		const area = args.join(" ");
		if (!area)
			return message.reply(getLang("syntaxError"));
		let areaKey, dataWeather, areaName;

		try {
			const response = (await axios.get(`https://api.accuweather.com/locations/v1/cities/search.json?q=${encodeURIComponent(area)}&apikey=${apikey}&language=en-us`)).data;
			if (response.length == 0)
				return message.reply(getLang("notFound", area));
			const data = response[0];
			areaKey = data.Key;
			areaName = data.LocalizedName;
		}
		catch (err) {
			return message.reply(getLang("error", err.response?.data?.Message || err.message));
		}

		try {
			dataWeather = (await axios.get(`http://api.accuweather.com/forecasts/v1/daily/10day/${areaKey}?apikey=${apikey}&details=true&language=en-us`)).data;
		}
		catch (err) {
			return message.reply(`❌ 𝗘𝗥𝗥𝗢𝗥: ${err.response?.data?.Message || err.message}`);
		}

		const dataWeatherDaily = dataWeather.DailyForecasts;
		const dataWeatherToday = dataWeatherDaily[0];
		const msg = getLang("today", areaName, dataWeather.Headline.Text, convertFtoC(dataWeatherToday.Temperature.Minimum.Value), convertFtoC(dataWeatherToday.Temperature.Maximum.Value), convertFtoC(dataWeatherToday.RealFeelTemperature.Minimum.Value), convertFtoC(dataWeatherToday.RealFeelTemperature.Maximum.Value), formatHours(dataWeatherToday.Sun.Rise), formatHours(dataWeatherToday.Sun.Set), formatHours(dataWeatherToday.Moon.Rise), formatHours(dataWeatherToday.Moon.Set), dataWeatherToday.Day.LongPhrase, dataWeatherToday.Night.LongPhrase);

		try {
			const bg = await Canvas.loadImage(__dirname + "/assets/image/bgWeather.jpg");
			const { width, height } = bg;
			const canvas = Canvas.createCanvas(width, height);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(bg, 0, 0, width, height);
			let X = 100;
			ctx.fillStyle = "#ffffff";
			const data = dataWeather.DailyForecasts.slice(0, 7);
			
			for (const item of data) {
				const icon = await Canvas.loadImage("http://vortex.accuweather.com/adc2010/images/slate/icons/" + item.Day.Icon + ".svg");
				ctx.drawImage(icon, X, 210, 80, 80);

				ctx.font = "30px BeVietnamPro-SemiBold";
				const maxC = `${convertFtoC(item.Temperature.Maximum.Value)}°C `;
				ctx.fillText(maxC, X, 366);

				ctx.font = "30px BeVietnamPro-Regular";
				const minC = String(`${convertFtoC(item.Temperature.Minimum.Value)}°C`);
				const day = moment(item.Date).format("DD");
				ctx.fillText(minC, X, 445);
				ctx.fillText(day, X + 20, 140);

				X += 135;
			}

			const pathSaveImg = `${__dirname}/tmp/weather_${areaKey}.jpg`;
			fs.ensureDirSync(`${__dirname}/tmp`);
			fs.writeFileSync(pathSaveImg, canvas.toBuffer());

			return message.reply({
				body: msg,
				attachment: fs.createReadStream(pathSaveImg)
			}, () => fs.unlinkSync(pathSaveImg));
		} catch (canvasErr) {
			// ইমেজ জেনারেট করতে সমস্যা হলে শুধু টেক্সট মেসেজ পাঠাবে
			return message.reply({ body: msg });
		}
	}
};
