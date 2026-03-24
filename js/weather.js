// 天气代码转换表（根据 WMO 标准）
const weatherCodeMap = {
    0: "晴朗",
    1: "大部晴朗", 2: "多云", 3: "阴天",
    45: "雾", 48: "雾",
    51: "毛毛雨", 53: "毛毛雨", 55: "小雨",
    61: "小雨", 63: "中雨", 65: "大雨",
    71: "小雪", 73: "中雪", 75: "大雪",
    80: "阵雨", 81: "强阵雨", 82: "暴雨",
    95: "雷阵雨", 96: "雷阵雨伴有冰雹", 99: "雷阵雨伴有重冰雹"
};

async function updateWeather() {
    try {
        // 1. 获取定位（这里换了一个支持中文路径的接口）
        const ipRes = await fetch('https://ipapi.co/json/');
        const location = await ipRes.json();
        
        if (location.city) {
            const { latitude, longitude, city } = location;
            
            // 2. 获取天气
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
            const data = await weatherRes.json();
            
            renderWeather(city, data);
        }
    } catch (error) {
        console.error("天气加载失败:", error);
        document.getElementById('current-temp').textContent = "天气获取失败";
    }
}

function renderWeather(city, data) {
    // 获取当前天气状态文字
    const code = data.current_weather.weathercode;
    const statusText = weatherCodeMap[code] || "未知";
    const currentTemp = data.current_weather.temperature;

    // 显示：城市 + 状态 + 温度 (如果城市是拼音，这里会显示拼音，但状态已经是汉字了)
    document.getElementById('current-temp').textContent = `${city} ${statusText} ${currentTemp}°C`;

    // 渲染预报
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
