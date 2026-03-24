async function updateWeather() {
    try {
        // 1. 通过 IP 获取位置 (无需授权，支持 HTTPS)
        const ipRes = await fetch('https://ipapi.co/json/');
        const location = await ipRes.json();
        
        if (location.city) {
            const { latitude, longitude, city } = location;
            
            // 2. 获取天气数据 (当前 + 未来两天)
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
            const data = await weatherRes.json();
            
            // 3. 渲染到页面
            renderWeather(city, data);
        }
    } catch (error) {
        console.error("天气加载失败:", error);
        document.getElementById('current-temp').textContent = "天气加载失败";
    }
}

function renderWeather(city, data) {
    // 显示城市和当前温度
    const currentTemp = data.current_weather.temperature;
    document.getElementById('current-temp').textContent = `${city} ${currentTemp}°C`;

    // 显示未来两天预报
    let forecastHTML = '';
    for(let i = 1; i <= 2; i++) {
        const dateStr = data.daily.time[i]; // 格式如 2026-03-25
        const shortDate = dateStr.split('-').slice(1).join('/'); // 变成 03/25
        const max = data.daily.temperature_2m_max[i];
        const min = data.daily.temperature_2m_min[i];
        
        forecastHTML += `
            <div class="forecast-day" style="margin-top: 5px; font-size: 0.9em; opacity: 0.8;">
                ${shortDate}: ${min}°C ~ ${max}°C
            </div>`;
    }
    document.getElementById('forecast').innerHTML = forecastHTML;
}

// 页面加载完成后执行
window.addEventListener('load', updateWeather);
