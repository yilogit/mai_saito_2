// 1. 在 weather.js 开头定义几个你常住的城市翻译
const cityTranslation = {
    "Shibuya City":"涩谷",
    "Hangzhou": "杭州",
    "Shanghai": "上海",
    "Beijing": "北京",
    "Tokyo": "东京",
    "Minato City": "港区",
    "Minato": "港区"
};

const weatherCodeMap = {
    0: "晴朗", 1: "大部晴朗", 2: "多云", 3: "阴天",
    45: "雾", 48: "雾", 51: "毛毛雨", 53: "毛毛雨", 55: "小雨",
    61: "小雨", 63: "中雨", 65: "大雨", 71: "小雪", 73: "中雪", 75: "大雪",
    80: "阵雨", 81: "强阵雨", 82: "暴雨", 95: "雷阵雨", 96: "雷阵雨伴有冰雹", 99: "雷阵雨伴有重冰雹"
};

async function updateWeather() {
    try {
        // --- 修改开始：使用更稳妥的获取方式 ---
        let locationData;
        
        try {
            // 尝试第一个接口 (ipapi.co)
            const res = await fetch('https://ipapi.co/json/');
            locationData = await res.json();
        } catch (e) {
            // 如果第一个失败，尝试第二个备用接口 (ip-api.com)
            const res = await fetch('http://ip-api.com/json/?lang=zh-CN');
            const data = await res.json();
            locationData = {
                latitude: data.lat,
                longitude: data.lon,
                city: data.city
            };
        }

        if (locationData && locationData.latitude) {
            const { latitude, longitude, city } = locationData;

            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
            const data = await weatherRes.json();

            renderWeather(city, data);
        } else {
            throw new Error("无法定位");
        }
    } catch (error) {
        console.error("天气加载失败:", error);
        document.getElementById('current-temp').textContent = "暂时无法获取天气";
    }
}

function renderWeather(city, data) {
    const translatedCity = cityTranslation[city] || city; 
    const code = data.current_weather.weathercode;
    const statusText = weatherCodeMap[code] || "未知";
    const currentTemp = data.current_weather.temperature;

    document.getElementById('current-temp').textContent = `${translatedCity} ${statusText} ${currentTemp}°C`;

    let forecastHTML = '';
    for(let i = 1; i <= 2; i++) {
        const dateStr = data.daily.time[i].split('-').slice(1).join('/');
        const max = data.daily.temperature_2m_max[i];
        const min = data.daily.temperature_2m_min[i];
        const dayCode = data.daily.weathercode[i];
        const dayStatus = weatherCodeMap[dayCode] || "未知";

        forecastHTML += `
            <div class="forecast-day" style="margin-top: 5px; font-size: 0.9em; opacity: 0.8;">
                ${dateStr} ${dayStatus} ${min}°C ~ ${max}°C
            </div>`;
    }
    document.getElementById('forecast').innerHTML = forecastHTML;
}

window.addEventListener('load', updateWeather);
