// src/utils/dateUtils.js

export function formatDateTime(datetimeStr) {
    const date = new Date(datetimeStr?.replace(" ", "T"));

    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    function getOrdinal(n) {
        if (n > 3 && n < 21) return `${n}th`;
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    }

    return `${getOrdinal(day)} ${month} ${year} at ${hours}:${minutes} ${ampm}`;
}
