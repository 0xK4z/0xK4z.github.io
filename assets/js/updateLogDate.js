function updateLogTimestamps() {
    const now = new Date();
    const MINUTE = 60000;
    
    const formatLogDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${min}:${s}`;
    };

    document.querySelectorAll('.log-timestamp').forEach((el, index) => {
      const time = new Date(now.getTime() - ((index + 1) * (Math.floor(Math.random() * 10) + 1) * MINUTE))
      el.innerText = formatLogDate(time);
    })
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', updateLogTimestamps);