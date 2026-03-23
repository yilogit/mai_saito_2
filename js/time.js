function updateClock() {
    const now = new Date();
    
    // 时间格式化
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('time').textContent = `${h}:${m}:${s}`;
    
    // 日期格式化
    const y = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    document.getElementById('date').textContent = `${y}/${mo}/${d}`;
}

// 每秒刷新
setInterval(updateClock, 1000);
updateClock(); // 初始化









function updateJLPT() {
    // 设定 2026 年夏季 JLPT 日期（通常是7月第一个周日）
    const examDate = new Date(2026, 6, 5, 9, 0, 0).getTime(); // 注意：月份从0开始，6代表7月
    const now = new Date().getTime();
    const diff = examDate - now;

    const daysLeftElement = document.getElementById('days-left');
    
    if (daysLeftElement) { // 先判断元素是否存在，防止报错
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            daysLeftElement.textContent = String(days).padStart(2, '0');
        } else {
            document.getElementById('jlpt-countdown').textContent = "Exam in progress";
        }
    }
}

// 确保每秒都在跑
setInterval(() => {
    // 如果你有 updateClock 函数，记得也写在这里
    if (typeof updateClock === 'function') updateClock(); 
    updateJLPT();
}, 1000);

// 页面加载完立即执行一次
window.onload = () => {
    updateJLPT();
    if (typeof updateClock === 'function') updateClock();
};