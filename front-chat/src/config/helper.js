export function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    
    const secondAgo = Math.floor((now - past) / 1000);
    if (secondAgo == 0) return "just now";
    if (secondAgo < 60) return `${secondAgo} seconds ago`;
    const minutesAgo = Math.floor(secondAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} minutes ago`;

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} hours ago`;

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) return `${daysAgo} days ago`;

    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) return `${monthsAgo} months ago`;

    const yearsAgo = Math.floor(monthsAgo / 24);
    return `${yearsAgo} years ago`;

}